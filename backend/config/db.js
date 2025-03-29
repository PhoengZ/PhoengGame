import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const mongoURI =  process.env.MONGO_URL;
mongoose.connect(mongoURI);