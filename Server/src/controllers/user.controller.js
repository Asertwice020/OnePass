import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.util.js";
import { ApiResponse } from "../utils/apiResponse.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { configEnv } from "../configEnv/index.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
  isResourceExists,
} from "../utils/cloudinary.util.js";
import jwt from "jsonwebtoken";
import fs from "fs";
import { SERVER } from "../constants.js";
import { Password } from "../models/password.model.js";
import { decrypt } from "../utils/encryption.js";

const checkResourceExists = asyncHandler(async (req, res) => {
  try {
    // 1. EXTRACTION: PUBLIC ID
    const { publicId } = req.body;
    // LOG
    // console.log({ reqBody: req.body });

    if (!publicId) {
      throw new ApiError(400, "Resource Public ID Is Missing!");
    }

    const resourceType = publicId.endsWith(".mp4") ? "video" : "image";

    // 2. CHECK RESOURCE EXISTS
    const response = await isResourceExists(publicId, resourceType);

    if (!response) {
      throw new ApiError(404, "Resource Not Found!");
    }

    // 3. SEND: RESPONSE ON FRONTEND
    return res
      .status(200)
      .json(
        new ApiResponse(200, "Your Resource Found Successfully!", response)
      );
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Failed To Check Resource Exists!",
      error,
      error?.stack
    );
  }
});

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Failed To Generating Access And Refresh Tokens!",
      error,
      error?.stack
    );
  }
};

const accessTokenExpiryTime = configEnv.ACCESS_TOKEN_MAXAGE_IN_MS;
const refreshTokenExpiryTime = configEnv.REFRESH_TOKEN_MAXAGE_IN_MS;

const accessTokenCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "None",
  expires: new Date(Date.now() + accessTokenExpiryTime),
};

const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "None",
  expires: new Date(Date.now() + refreshTokenExpiryTime),
};

const registerUser = asyncHandler(async (req, res) => {
  let avatarLocalPath;
  try {
    // 1. EXTRACTION: REGISTRATION DETAILS FROM REQ-BODY
    const { username, email, password } = req.body;

    // 2: EXTRACTION: AVATAR ( IF EXISTS )
    if (req?.file && req?.file?.path && req?.file instanceof Object) {
      avatarLocalPath = req.file.path;
    }

    // 3. VALIDATOR: ALL FIELDS ARE REQUIRED
    const emptyFieldsValidation = [username, email, password].some(
      (field) => !field || field.trim().length === 0
    );

    if (emptyFieldsValidation) {
      throw new ApiError(400, "All Fields Are Required!");
    }

    // 4. VALIDATOR: USERNAME CONVENTION
    const usernameRegex = /^[a-zA-Z0-9._-]+$/;

    if (!usernameRegex.test(username.trim())) {
      throw new ApiError(400, "Invalid Username!");
    }

    // 5. VALIDATOR: EMAIL
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email.trim())) {
      throw new ApiError(400, "Invalid Email Address!");
    }

    // 6. VALIDATOR: PASSWORD LENGTH
    if (password.trim().length < 8) {
      throw new ApiError(400, "Password Must Be At Least 8 Characters!");
    }

    // 7. VALIDATOR: DOES USER EXISTS ALREADY
    const existedUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existedUser) {
      throw new ApiError(
        409,
        "User With This Username or Email Already Exists!"
      );
    }

    // 8. UPLOAD: AVATAR ON CLOUDINARY
    let avatar;
    if (avatarLocalPath) {
      avatar = await uploadToCloudinary(avatarLocalPath);
      // YOU DON'T NEED TO ADD EXTRA VALIDATOR TO CHECK: AVATAR GETS THE CORRECT VALUE OR NOT, CAUSE ALREADY WROTE THE LOGIC IF AVATAR GETS ANY ERROR WHILE UPLOADING ON CLOUDINARY. AND IF IT GETS AN ERROR SO THE "avatar" GETS THE OBJECT IN IT. AND THEN THIS ERROR PASSED TO THIS "registerUser" CONTROLLER CATCH PART. AND IT WILL SHOW THAT ERROR WHICH APPROPRIATE MANNER. CAUSE YOU ADD THERE "error?.message"
    }

    // 9. CREATION: USER OBJECT/DOCUMENT IN DB
    const user = await User.create({
      avatar: avatar?.url ?? "",
      username: username.toLowerCase(),
      email,
      password,
      masterKey: "",
    });

    if (!user) {
      throw new ApiError(500, "Failed To Create User Document In DB!");
    }

    // 10. DELETION: REMOVING PASSWORD, REFRESH-TOKEN BEFORE SENDING RESPONSE TO FRONTEND
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
      throw new ApiError(501, "Failed To Create Your Account In DB!");
    }

    // LOG
    // console.log({ createdUser });

    // 11. SEND: RESPONSE ON FRONTEND
    return res
      .status(201)
      .json(
        new ApiResponse(200, "Your Account Created Successfully!", createdUser)
      );
  } catch (error) {
    // MONGOOSE-VALIDATOR: VALIDATING ERRORS USING MONGOOSE'S BUILT-IN MSGS
    if (error.name === "ValidationError") {
      console.error({ allErrorDotName: error.name });
      const validationErrors = [];
      for (const field in error.errors) {
        validationErrors.push(error.errors[field].message);
      }
      console.error({ validationErrors });
      throw new ApiError(400, validationErrors.join(", "));
    }

    // DELETION: REMOVING AVATAR FROM TEMP FOLDER OF SERVER WHILE AN ERROR OCCURS
    fs.existsSync(avatarLocalPath) && fs.unlinkSync(avatarLocalPath);

    throw new ApiError(
      500,
      error?.message || "Something Went Wrong While Registering The User!",
      error,
      error?.stack
    );
  }
});

const loginUser = asyncHandler(async (req, res) => {
  try {
    // 1. EXTRACTION: LOGIN DETAILS FROM REQ-BODY
    const { email, password } = req.body;

    // 2. VALIDATOR: ALL FIELDS ARE REQUIRED
    const emptyFieldsValidation = [email, password].some(
      (field) => !field || field.trim().length === 0
    );

    if (emptyFieldsValidation) {
      throw new ApiError(400, "All Fields Are Required!");
    }

    // 3. FIND: USER IN DB
    const user = await User.findOne({
      $or: [{ email }],
    });

    if (!user) {
      throw new ApiError(404, "User Does Not Exists!");
    }

    // 4. VALIDATOR: PASSWORD
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new ApiError(400, "Invalid Password!");
    }

    // 5. GENERATION: ACCESS & REFRESH TOKENS
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );

    // LOG
    // console.log({ accessToken, refreshToken });

    // FIXME: UPDATE THE USER OBJECT WITH TOKENS INSTEAD OF MAKING ANOTHER REQUEST TO DB, WHICH YOU ARE DOING RIGHT NOW! [CHECK IT NEEDS A _id OR NOT AND IF NOT SO HOW IT'S WORKING]

    // 6. DELETION: REMOVING PASSWORD, REFRESH-TOKEN BEFORE SENDING RESPONSE TO FRONTEND
    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!loggedInUser) {
      throw new ApiError(501, "Failed To Made You Logged In!");
    }

    // console.log("USER LOGGED IN SUCCESSFULLY 😎\n", { loggedInUser });
    // 7. SEND: RESPONSE ON FRONTEND
    return res
      .status(200)
      .cookie("accessToken", accessToken, accessTokenCookieOptions)
      .cookie("refreshToken", refreshToken, refreshTokenCookieOptions)
      .json(
        new ApiResponse(200, "User Logged In Successfully!", {
          user: loggedInUser,
          accessToken,
          refreshToken,
        })
      );
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something Went Wrong While Your Logging!",
      error,
      error?.stack
    );
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  try {
    // 1. VALIDATOR: LOGGED-IN
    if (!req?.user) {
      throw new ApiError(401, "Unauthorized Request!");
    }

    // 2. DELETION: REMOVING REFRESH-TOKEN FIELD FROM THAT PARTICULAR USER-DOCUMENT
    await User.findByIdAndUpdate(
      req.user._id,
      // DELETION: REMOVING REFRESH TOKEN FIELD FROM DOCUMENT
      { $unset: { refreshToken: 1, accessToken: 1 } },
      { new: true }
    );

    return (
      res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, "User Logged Out Successfully!", {}))
    );
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while logging out the user!!!",
      "No tips",
      error,
      error?.stack
    );
  }
});

const generateNewAccessToken = asyncHandler(async (req, res) => {
  try {
    // 1. EXTRACTION: REFRESH TOKEN
    const incomingRefreshToken =
      req?.cookies?.refreshToken || req?.body?.refreshToken;

    // LOG
    console.log('BEFORE\n',{refreshToken : incomingRefreshToken || req?.body?.refreshToken, accessToken : req?.cookies?.accessToken, incomingRefreshToken});

    if (!incomingRefreshToken) {
      throw new ApiError(401, "Unauthorized Request!");
    }

    // 2. VERIFY: PROVIDED REFRESH TOKEN
    const decodedToken = await jwt.verify(
      incomingRefreshToken,
      configEnv.REFRESH_TOKEN_SECRET
    );

    if (!decodedToken) {
      throw new ApiError(401, "Invalid Refresh Token ID!");
    }

    // 3. FIND: USER IN DB
    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token ID!");
    }

    // 4. COMPARE AND VERIFY: PROVIDED TOKEN & FETCHED/DECODED TOKEN
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh Token Is Either Expired or Used!");
    }

    // 5. GENERATION: ACCESS TOKEN
    const accessToken = user.generateAccessToken();

    if (!accessToken) {
      throw new ApiError(401, "Failed To Generate Access Token!");
    }

    // LOG
    // console.log('AFTER\n',{refreshToken : incomingRefreshToken || req?.body?.refreshToken, accessToken});

    // 6. SEND: RESPONSE ON FRONTEND
    return (
      res
        .status(200)
        .cookie("accessToken", accessToken, accessTokenCookieOptions)
        .json(
          new ApiResponse(200, "Access Token Refreshed Successfully!", {
            accessToken,
          })
        )
    );
  } catch (error) {
    throw new ApiError(
      401,
      error?.message || "Unauthorized Request",
      error,
      error?.stack
    );
  }
});

const editProfile = asyncHandler(async (req, res) => {
  let newAvatar;
  let avatarLocalPath;
  try {
    // 0. REFINE & FILTER: USER GIVES USERNAME || OLD-PASSWORD & NEW-PASSWORD TO CHANGE - UPDATE THE REQ-BODY
    const { username, oldPassword, newPassword } = req.body;

    if (username || oldPassword || newPassword) {
      username ? (req.body.username = username) : null;
      oldPassword ? (req.body.oldPassword = oldPassword) : null;
      newPassword ? (req.body.newPassword = newPassword) : null;
    }

    // LOG
    // console.log({ reqBody: req.body, reqFile: req.file });

    // 1. VALIDATOR: USERNAME CONVENTION
    const usernameRegex = /^[a-zA-Z0-9._-]+$/;
    if (username) {
      if (!usernameRegex.test(username)) {
        throw new ApiError(400, "Invalid Username!");
      }
    }

    // 1.1 VALIDATOR: AVAILABILITY OF USERNAME
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      throw new ApiError(400, "Username is already taken");
    }

    // 2. VALIDATOR: CHECK OLD PASSWORD MATCHES WITH THE ONE IN DB
    const user = await User.findById(req.user?._id);

    if (!user) {
      throw new ApiError(404, "User Not Found!");
    }

    if (oldPassword && newPassword) {
      if (oldPassword === newPassword) {
        throw new ApiError(
          400,
          "Old Password Cannot Be The Same As New Password!"
        );
      }

      const isPasswordCorrect = await user.comparePassword(oldPassword);

      if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid Old Password");
      }
    }

    // 3: EXTRACTION: AVATAR ( IF EXISTS )
    if (req?.file && req?.file?.path && req?.file instanceof Object) {
      avatarLocalPath = req.file.path;
      // console.log({avatarLocalPath})
    }

    // 4. UPLOAD: AVATAR ON CLOUDINARY
    avatarLocalPath && (newAvatar = await uploadToCloudinary(avatarLocalPath));

    // 5. VALIDATOR: AVATAR UPLOADED ON CLOUDINARY
    if (avatarLocalPath) {
      if (!newAvatar || !newAvatar.url) {
        throw new ApiError(503, "Failed To Upload Your Avatar On Cloudinary!");
      }
    }

    // 6. UPDATION: SAVE NEW AVATAR & PASSWORD FIELDS VALUES WITH NEW ONE IN DB
    avatarLocalPath && (user.avatar = newAvatar.url);
    oldPassword && newPassword && (user.password = newPassword);
    username && (user.username = username);
    await user.save({ validateBeforeSave: false });

    // 7. DELETION: OLD AVATAR FROM CLOUDINARY ( IF EXISTS )
    avatarLocalPath && deleteFromCloudinary(user.avatar);

    // 8. VALIDATOR: VERIFY REPLACEMENT WAS SUCCESSFULLY DONE
    const updatedUser = await User.findById(req.user?._id).select(
      "-password -refreshToken"
    );

    if (!updatedUser) {
      throw new ApiError(501, "Failed To Update Your Profile!");
    }

    // 9. SEND: RESPONSE ON FRONTEND
    return res
      .status(200)
      .json(
        new ApiResponse(200, "Your Profile Updated Successfully!", updatedUser)
      );
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Failed To Update Your Profile!",
      error,
      error?.stack
    );
  }
});

const checkUsernameAvailability = asyncHandler(async (req, res) => {
  try {
    const { username } = req.body;

    // NOTE: I ALREADY VALIDATED THAT USERNAME CAN'T BE CALLED IF IT'S EMPTY! BUT IT'S FOR EXCEPTIONS
    if (!username) {
      return res
        .status(200)
        .json(
          new ApiResponse(200, "Username Can't Be Empty!", {
            available: false,
          })
        );
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res
      .status(200)
      .json(new ApiResponse(200, "Username Is Already Taken!", {available: false,}));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "Username Is Available", { available: true }));
  } catch (error) {
    throw new ApiError(500, error?.message || "Failed To Check Username Availability!", error);
  }
});

const getStoredPasswords = asyncHandler(async (req, res) => {
  try {
    // 1. FETCH - STORED-PASSWORDS & COMPROMISED-PASSWORDS & COUNT
    const userStoredPasswordsData = await User.aggregate([
      { $match: { _id: req?.user?._id } },
      {
        $lookup: {
          from: "passwords",
          localField: "storedPasswords",
          foreignField: "_id",
          as: "storedPasswords",
        },
      },
      {
        $lookup: {
          from: "passwords",
          localField: "compromisedPasswords",
          foreignField: "_id",
          as: "compromisedPasswords",
        },
      },
      {
        $addFields: {
          passwordCount: { $size: "$storedPasswords" },
          compromisedPasswordCount: { $size: "$compromisedPasswords" },
        },
      },
      {
        $project: {
          passwordCount: 1,
          storedPasswords: 1,
          storedPasswordCount: 1,
          compromisedPasswords: 1,
          compromisedPasswordCount: 1,
        },
      },
    ]);

    if (!userStoredPasswordsData.length) {
      return res
        .status(404)
        .json(new ApiResponse(404, "No Stored Passwords Found!", []));
    }

    // 2. Return the user with passwords and count
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "User passwords retrieved successfully",
          userStoredPasswordsData
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Failed to retrieve user passwords",
      error,
      error?.stack
    );
  }
});

const getCompromisedPasswords = asyncHandler(async (req, res) => {
  try {
    // 1. FETCH - COMPROMISED-PASSWORDS & COUNT
    const user = await User.findById(req?.user?._id).populate(
      "compromisedPasswords"
    );

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Return compromised passwords
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Compromised passwords retrieved successfully",
          user.compromisedPasswords
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Failed to retrieve compromised passwords",
      error
    );
  }
});

const fetchUpdatedUserDetails = asyncHandler(async (req, res) => {
  try {
    // 1. FETCH - USER
    const user = await User.findById(req?.user?._id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // 2. SEND: RESPONSE ON FRONTEND
    return res
      .status(200)
      .json(new ApiResponse(200, "User retrieved successfully", user));
  } catch (error) {
    throw new ApiError(500, error?.message || "Failed to retrieve user", error);
  }
});

const getDecryptedPassword = asyncHandler(async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      throw new ApiError(400, "Card Password Is Missing!");
    }

    const decryptedPassword = await decrypt(password);

    if (!decryptedPassword) {
      throw new ApiError(500, "Failed To Decrypt Password!");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "Password Decrypted Successfully", decryptedPassword));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Failed To Decrypt Password!",
      error
    );
  }
});

export {
  registerUser, // ✅
  loginUser, // ✅
  logoutUser, // ✅
  generateNewAccessToken, // ✅
  editProfile,
  checkUsernameAvailability, // ✅
  getStoredPasswords,
  checkResourceExists, // ✅
  fetchUpdatedUserDetails, // ✅
  getDecryptedPassword, // ✅
};
