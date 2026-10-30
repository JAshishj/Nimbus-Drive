import "./config/env.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import verifyJWT from "./middleware/verifyJWT.js";
import meRoute from "./routes/me.js";
import registerRoute from "./routes/register.js";
import loginRoute from "./routes/login.js";
import refreshRoute from "./routes/refresh.js";
import logoutRoute from "./routes/logout.js";
import filesRoute from "./routes/files.js";
import foldersRoute from "./routes/folders.js";
import shareRoute from "./routes/shares.js";
import starRoute from "./routes/star.js";

const app = express();

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many attempts, please try again in a minute" },
});

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many attempts, please try again in a minute" },
});

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(helmet());
app.use(cookieParser());
app.use(express.json());

app.use(apiLimiter);
app.use("/", authLimiter, registerRoute);
app.use("/", authLimiter, loginRoute);
app.use("/", refreshRoute);
app.use("/", logoutRoute);

app.use(verifyJWT);
app.use("/", meRoute);
app.use("/", filesRoute);
app.use("/", foldersRoute);
app.use("/", shareRoute);
app.use("/", starRoute);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
