import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import userRouter from "./routes/user.routes.js";
import quizRouter from "./routes/quiz.routes.js";
import { initSocketService } from "./services/socket.service.js";

const quizRooms = {};

dotenv.config();
const app = express();
const server = http.createServer(app);

// Initialize Socket Service
initSocketService(server);

app.use(express.json());
app.use(cors());

app.use("/user", userRouter);
app.use("/quiz", quizRouter);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to database");
  })
  .then(
    server.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    })
  )
  .catch((err) => {
    console.log(err);
  });
