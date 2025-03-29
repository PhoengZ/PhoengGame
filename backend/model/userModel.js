import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    point: { type: Number},
    countdown_time: { type: Date },
    health:{type:Number}
});
const customer = mongoose.model("user",userSchema,"user");

export default customer;