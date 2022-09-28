import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import UserRouter from "./routes/userRouter.js";
import videoRouter from "./routes/videoRouter.js";
import commentRouter from "./routes/commentRouter.js";
import authRouter from "./routes/authRouter.js";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config({ path: "./config.env" });

const DB = process.env.MONGONODE_CONNECTIONSTRING.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASS
);

const connect = () => {
  mongoose
    .connect(DB)
    .then(() => {
      console.log("Connected to MongoCloud Succesfully");
    })
    .catch((err) => {
      throw err;
    });
};
app.use(cookieParser());
app.use(express.json());
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", UserRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/comments", commentRouter);

app.use((err, req, res, next) => {
  const status = Number(err.status) || 500;
  const message = err.message || "Something Went Wrong";
  return res.status(status).json({
    success: false,
    status: status,
    message: message,
  });
});

app.listen(8800, () => {
  connect();
  console.log("Connected");
});
