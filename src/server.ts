import app from "./app";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

const port = process.env.PORT || 5000;
const dbUri = process.env.MONGODB_URI as string;

mongoose
  .connect(dbUri)
  .then(() => {
    console.log("Connect DB success.");
  })
  .catch((err) => {
    console.log(`Connect DB fail. Err: ${err}`);
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
