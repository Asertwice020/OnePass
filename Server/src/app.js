import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import { configEnv } from "./configEnv/index.js";
import { SERVER } from "./constants.js";

const app = express();

const corsOptions = {
  origin: (origin, callback) => {
    if (configEnv.CLIENT_CORS_ORIGIN.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: SERVER.JSON_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: SERVER.JSON_LIMIT }));
app.use(express.static("public"));
app.use(cookieParser());

// ROUTES IMPORTS - WITH CUSTOM NAMES TO BEING ACCOUNTABLE
import { router as userRoute } from "./routes/user.route.js";
import { router as passwordRoute } from "./routes/password.route.js";

app.use("/api/v1/users", userRoute);
app.use("/api/v1/passwords", passwordRoute);

export { app };