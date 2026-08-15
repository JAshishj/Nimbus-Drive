import "./config/env.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import registerRoute from "./routes/register.js";
import loginRoute from "./routes/login.js";
import refreshRoute from "./routes/refresh.js";
import logoutRoute from "./routes/logout.js";
import filesRoute from "./routes/files.js";
import meRoute from "./routes/me.js";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

app.use("/", meRoute);
app.use("/", registerRoute);
app.use("/", loginRoute);
app.use("/", refreshRoute);
app.use("/", logoutRoute);
app.use("/", filesRoute);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
