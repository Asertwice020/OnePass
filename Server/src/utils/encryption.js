import crypto from "crypto";
import { configEnv } from "../configEnv/index.js";

const secretKeyString = configEnv.CRYPTO_ENCRYPTION_SECRET_KEY
const secretKey = crypto.createHash("sha256").update(secretKeyString).digest();
const ivLength = 16;
const algorithm = "aes-256-ctr";

const encrypt = (password) => {
  const iv = crypto.randomBytes(ivLength);
  const cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(secretKey, "hex"),
    iv
  );
  const encrypted = Buffer.concat([cipher.update(password), cipher.final()]);
  return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
};

const decrypt = (hash) => {
  const [iv, encrypted] = hash.split(":");
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(secretKey, "hex"),
    Buffer.from(iv, "hex")
  );
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encrypted, "hex")),
    decipher.final(),
  ]);
  return decrypted.toString();
};

export { encrypt, decrypt };