import { Schema, model } from "mongoose";
import jwt from "jsonwebtoken";
import { configEnv } from "../configEnv/index.js";
import { encrypt, decrypt } from "../utils/encryption.js";

const userSchema = new Schema(
  {
    // REFERENCE: TO PASSWORD MODEL
    storedPasswords: [{ type: Schema.Types.ObjectId, ref: "Password" }],

    avatar: {
      type: String,
      default: "",
    },

    username: {
      type: String,
      required: [true, "Name Is Required!"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    email: {
      type: String,
      required: [true, "Email Is Required!"],
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: [true, "Password Is Required!"],
      min: 8,
      max: 25,
    },

    masterKey: {
      type: String,
      default: "",
    },

    storedPasswords: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Password",
        },
      ],
    },

    compromisedPasswords: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Password",
        }
      ]
    },
    
    storedPasswordCount: {
      type: Number,
      default: 0,
    },

    compromisedPasswordCount: {
      type: Number,
      default: 0,
    },

    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await encrypt(this.password);
  next();
});

userSchema.methods.comparePassword = async function (password) {
  const decryptedPassword = await decrypt(this.password);
  return password === decryptedPassword;
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
    },
    configEnv.ACCESS_TOKEN_SECRET,
    {
      expiresIn: configEnv.ACCESS_TOKEN_EXPIRY,
    },
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    configEnv.REFRESH_TOKEN_SECRET,
    {
      expiresIn: configEnv.REFRESH_TOKEN_EXPIRY,
    },
  );
};

const User = model("User", userSchema);
export { User };