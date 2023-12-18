import express from "express";
import cors from "cors";
import env from "dotenv";
import { router as authRoute } from "./routes/auth.route.js";
import { logger, verifyToken } from "./middlewares/errorLogger.js";
import { userRouter } from "./routes/user.route.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

env.config();

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

console.log(process.env.NODE_ENV);

//app.use(verifyToken)
app.use("/auth", authRoute);
app.use("/users", verifyToken, userRouter);
app.use(logger);

app.post("/login", (req, res) => {
  res.send("Test");
});

app.listen(process.env.PORT, () => {
  console.log("Start Server App...");
});
