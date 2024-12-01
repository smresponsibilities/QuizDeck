import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import UserRouter from "./routes/user.routes.js";

dotenv.config();
const port = 8080;
const app = express();

app.use(express.json());
app.use(cors());
app.use("/user", UserRouter);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to database");
  })
  .then(
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    })
  )
  .catch((err) => {
    console.log(err);
  });
