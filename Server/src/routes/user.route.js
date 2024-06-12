import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// IMPORTS OF CONTROLLERS METHODS
import {
  registerUser,
  loginUser,
  logoutUser,
  editProfile,
  checkUsernameAvailability,
  generateNewAccessToken,
  getStoredPasswords,
  checkResourceExists,
  fetchUpdatedUserDetails,
  getDecryptedPassword,
} from "../controllers/user.controller.js";

// --- UN-SECURED ROUTES ---

// 1. REGISTER
router.route("/register").post(upload.single("avatar"), registerUser);

// LOGIN
router.route("/login").post(loginUser);

// --- SECURED ROUTES ---

// LOGOUT
router.route("/logout").get(verifyJWT, logoutUser);

// GENERATE NEW ACCESS TOKEN
router.route("/get-new-access-token").get(generateNewAccessToken);

// EDIT PROFILE
router.route("/edit-profile").patch(verifyJWT, upload.single("avatar"), editProfile);

// STORED PASSWORDS
router.route("/all-passwords").get(verifyJWT, getStoredPasswords);

// CHECK RESOURCE EXISTS
router.route("/resource-exists").post(verifyJWT, checkResourceExists);

// FETCH UPDATED USER DETAILS
router.route("/fetch-new-user-details").get(verifyJWT, fetchUpdatedUserDetails);

// CHECK FOR USERNAME AVAILABILITY
router.route("/check-username-availability").post(verifyJWT, checkUsernameAvailability);

// DECRYPT PASSWORD
router.route("/decrypt-password").post(verifyJWT, getDecryptedPassword);

export { router };