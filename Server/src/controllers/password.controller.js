import { Password } from "../models/password.model.js";
import { ApiError } from "../utils/apiError.util.js";
import { ApiResponse } from "../utils/apiResponse.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { User } from '../models/user.model.js'
import { encrypt, decrypt } from "../utils/encryption.js";

const addPassword = asyncHandler(async (req, res) => {
  try {
    // 1. EXTRACTION: REGISTRATION DETAILS FROM REQ-BODY
    const { category, title, url, email, password, note } = req.body;

    // 2. VALIDATOR: ALL FIELDS ARE REQUIRED
    const emptyFieldsValidation = [category, title, email, password].some(
      (field) => !field || field.trim().length === 0
    );

    if (emptyFieldsValidation) {
      throw new ApiError(400, "Major Fields Are Required!");
    }

    // 3. VALIDATOR: TITLE CONVENTION
    const titleRegex = /^[a-zA-Z0-9@!-_]+$/;

    if (!titleRegex.test(title.trim())) {
      throw new ApiError(400, "Invalid Title!");
    }

    // 4. VALIDATOR: EMAIL
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email.trim())) {
      throw new ApiError(400, "Invalid Email Address!");
    }

    // 5. VALIDATOR: DOES PASSWORD EXISTS ALREADY IN STORED PASSWORDS ARRAY
    const user = await User.findById(req?.user?._id).populate(
      "storedPasswords"
    );

    if (!user?.storedPasswords) {
      throw new ApiError(
        400,
        "User Does Not Have Any Stored Passwords Field!"
      )
    }

    const passwordExistsInStoredPasswordsArr = user.storedPasswords.find(
      (pwd) => pwd.title === title && pwd.email === email
    );

    if (passwordExistsInStoredPasswordsArr) {
      throw new ApiError(
        409,
        "Password With Same Title & Email Is Already Exists In Your Stored Passwords!"
      );
    }

    // 6. VALIDATOR: DOES PASSWORD EXISTS ALREADY IN PASSWORD COLLECTION
    const existedPasswordInDB = await Password.findOne({
      $and: [{ email }, { title }],
    });

    if (existedPasswordInDB) {
      throw new ApiError(409, "Password With Same Title & Email Already Exists In DB!");
    }

    // 7. CREATION: USER OBJECT/DOCUMENT IN DB
    const passwordObj = await Password.create({
      category: category.toLowerCase() ?? "other",
      title: title.toLowerCase(),
      url,
      email,
      password,
      note,
      userId: req.user._id,
    });

    if (!passwordObj) {
      throw new ApiError(500, "Failed To Save Password Document In DB!");
    }

    // 8. UPDATE: USER DOCUMENT WITH THE NEW PASSWORD ID
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: { storedPasswords: passwordObj._id },
        $set: { storedPasswordCount: user.storedPasswords.length + 1 },
      },
      { new: true }
    );

    if (!updatedUser) {
      throw new ApiError(500, "Failed To Update Stored Passwords Array In User Document!");
    }

    // 9. SEND: RESPONSE ON FRONTEND
    return res
      .status(201)
      .json(
        new ApiResponse(200, "Your Password Created Successfully!", passwordObj)
      );
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Failed To Add Password!",
      error,
      error?.stack
    )
  }
})

const updatePassword = asyncHandler(async (req, res) => {
  try {
    // 1. EXTRACTION: UPDATED DETAILS FROM REQ-BODY
    const { cardId, category, title, url, email, password, note } = req.body;

    // 1.5 VALIDATOR: CARD-ID
    if (!cardId) {
      throw new ApiError(400, "Card Id Is Required!");
    }

    // 2. VALIDATOR: ALL FIELDS ARE REQUIRED
    const emptyFieldsValidation = [category, title, email, password].some(
      (field) => !field || field.trim().length === 0
    );

    if (emptyFieldsValidation) {
      throw new ApiError(400, "Major Fields Are Required!");
    }

    // 3. VALIDATOR: TITLE CONVENTION
    const titleRegex = /^[a-zA-Z0-9@!-_]+$/;

    if (!titleRegex.test(title.trim())) {
      throw new ApiError(400, "Invalid Title!");
    }

    // 4. VALIDATOR: EMAIL
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email.trim())) {
      throw new ApiError(400, "Invalid Email Address!");
    }

    // 4.5. VALIDATOR: PASSWORD LENGTH
    if (password.trim().length < 8) {
      throw new ApiError(400, "Password Must Be At Least 8 Characters!");
    }

    // 5. GRAB: PASSWORD DOCUMENT FROM DB
    const currentPassword = await Password.findById(cardId);

    if (!currentPassword) {
      throw new ApiError(404, "Password Not Found!");
    }

    // 6. MATCH: CHECK IF PASSWORD CHANGED
    const doesUserChangePassword =
      await currentPassword.comparePassword(password);

    // 7. MATCH: CHECK IF ANY OTHER FIELDS CHANGED
    const hasChanges = [
      { current: currentPassword.category, updated: category },
      { current: currentPassword.title, updated: title },
      { current: currentPassword.url, updated: url },
      { current: currentPassword.email, updated: email },
      { current: currentPassword.note, updated: note },
    ].some(
      ({ current, updated }) =>
        current.trim().toLowerCase() !== updated.trim().toLowerCase()
    );

    if (!hasChanges && !doesUserChangePassword) {
      throw new ApiError(400, "No Changes Made By User!");
    }

    // 8. UPDATE :: PASSWORD DOCUMENT IN DB
    const updateData = {
      category: category.trim().toLowerCase(),
      title: title.trim().toLowerCase(),
      url: url.trim().toLowerCase(),
      email: email.trim().toLowerCase(),
      note: note.trim().toLowerCase(),
    };

    // 8.5. ENCRYPT: PASSWORD FIELD IN DB
    if (doesUserChangePassword) {
      updateData.password = await encrypt(password.trim());
    }

    const updatedPassword = await Password.findByIdAndUpdate(
      cardId,
      updateData,
      { new: true }
    );

    if (!updatedPassword) {
      throw new ApiError(500, "Failed To Update Password Document In DB!");
    }

    // 9. SEND: RESPONSE ON FRONTEND
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Your Password Updated Successfully!",
          updatedPassword
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Failed To Update Password!",
      error,
      error?.stack
    );
  }
})

const deletePassword = asyncHandler(async (req, res) => {
  try {
    // 1. EXTRACTION: UPDATED DETAILS FROM REQ-BODY
    const { cardId } = req.body;

    // 1.5 VALIDATOR: CARD-ID
    if (!cardId) {
      throw new ApiError(400, "Card Id Is Required!");
    }

    // 2. FIND & DELETE: PASSWORD DOCUMENT FROM DB
    const deletedPassword = await Password.findByIdAndDelete(cardId);

    if (!deletedPassword) {
      throw new ApiError(404, "Password Not Found!");
    }

    // 3. SEND: RESPONSE ON FRONTEND
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Your Password Deleted Successfully!",
          deletePassword
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Failed To Delete Password!",
      error,
      error?.stack
    );
  }
});

export { addPassword, updatePassword, deletePassword };