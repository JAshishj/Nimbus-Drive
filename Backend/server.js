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

// Render (and most hosts) sit behind a reverse proxy. Trust exactly one hop
// so rate limiting keys on the real client IP instead of the proxy's IP.
app.set("trust proxy", 1);

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
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

// Rate-limit only the sensitive auth endpoints. Read endpoints (/me, /files,
// /folders) are JWT-protected and shouldn't consume a shared browse quota.
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
