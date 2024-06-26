import dotenv from "dotenv";
dotenv.config({ path: ".env" });

const validateEnvVar = (varName, expectedType) => {
  const value = process.env[varName];

  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }

  // Convert before type check
  let convertedValue;
  if (expectedType === "number") {
    convertedValue = Number(value);
  } else if (expectedType === "array") {
    convertedValue = value.split(",").map((domain) => domain.trim());
  } else {
    convertedValue = value;
  }

  if (typeof convertedValue !== expectedType && !Array.isArray(convertedValue)) {
    throw new Error(
      `Invalid type for environment variable: ${varName}. Expected ${expectedType}, got ${typeof value}`,
    );
  }

  return convertedValue;
};

const configEnv = {
  PORT: validateEnvVar("PORT", "number"),

  MONGODB_URI: validateEnvVar("MONGODB_URI", "string"),

  CLIENT_CORS_ORIGIN: validateEnvVar("CLIENT_CORS_ORIGIN", "array"),

  CRYPTO_ENCRYPTION_SECRET_KEY: validateEnvVar("CRYPTO_ENCRYPTION_SECRET_KEY", "string"),

  CLOUDINARY_CLOUD_NAME: validateEnvVar("CLOUDINARY_CLOUD_NAME", "string"),

  CLOUDINARY_API_KEY: validateEnvVar("CLOUDINARY_API_KEY", "string"),

  CLOUDINARY_API_SECRET: validateEnvVar("CLOUDINARY_API_SECRET", "string"),

  ACCESS_TOKEN_SECRET: validateEnvVar("ACCESS_TOKEN_SECRET", "string"),

  ACCESS_TOKEN_EXPIRY: validateEnvVar("ACCESS_TOKEN_EXPIRY", "string"),

  ACCESS_TOKEN_MAXAGE_IN_MS: validateEnvVar("ACCESS_TOKEN_MAXAGE_IN_MS", "number"),

  REFRESH_TOKEN_SECRET: validateEnvVar("REFRESH_TOKEN_SECRET", "string"),

  REFRESH_TOKEN_EXPIRY: validateEnvVar("REFRESH_TOKEN_EXPIRY", "string"),

  REFRESH_TOKEN_MAXAGE_IN_MS: validateEnvVar("REFRESH_TOKEN_MAXAGE_IN_MS", "number"),
};

export { configEnv };