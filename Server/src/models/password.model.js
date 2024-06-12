import { Schema, model } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { encrypt, decrypt } from "../utils/encryption.js";

const passwordSchema = new Schema(
  {
    // REFERENCE: TO USER MODEL
    userId: { type: Schema.Types.ObjectId, ref: "User" },

    category: {
      type: String,
      default: "",
    },

    title: {
      type: String,
      required: [true, "Title Is Required!"],
      trim: true,
      lowercase: true,
    },

    url: {
      type: String,
      required: [true, "Url Is Required!"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is Required!"],
      lowercase: true,
    },

    password: {
      type: String,
      required: [true, "Password is Required!"],
      min: 8,
      max: 50,
    },

    note: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

passwordSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await encrypt(this.password);
  next();
});

passwordSchema.methods.comparePassword = async function (password) {
  const decryptedPassword = await decrypt(this.password);
  return !(password === decryptedPassword);
};

passwordSchema.plugin(mongooseAggregatePaginate);

const Password = model("Password", passwordSchema);
export { Password };
