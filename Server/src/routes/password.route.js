import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// IMPORTS OF CONTROLLERS METHODS
import {
  addPassword,
  updatePassword,
  deletePassword,
} from "../controllers/password.controller.js";

// --- SECURED ROUTES ---

// ADD PASSWORD
router.route("/add").post(verifyJWT, addPassword);

// UPDATE PASSWORD
router.route("/update").patch(verifyJWT, updatePassword);

// DELETE PASSWORD
router.route("/delete").post(verifyJWT, deletePassword);

export { router };
