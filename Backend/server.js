import "./config/env.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import registerRoute from "./routes/register";
import loginRoute from "./routes/login";
import refreshRoute from "./routes/refresh";
import logoutRoute from "./routes/logout";
import filesRoute from "./routes/files";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

app.use("/", registerRoute);
app.use("/", loginRoute);
app.use("/", refreshRoute);
app.use("/", logoutRoute);
app.use("/", filesRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
