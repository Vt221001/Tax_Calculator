import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

export const connectDb = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
    console.log(`${process.env.MONGO_URI}/${DB_NAME}`)
    console.log("Connected to database");
  } catch (error) {
    console.log("Error in connecting to database", error);
    process.exit(1);
  }
};
