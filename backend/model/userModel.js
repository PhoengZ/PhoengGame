import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    itemName:{
        type:String,
        required:true
    },
    itemDescription:{
        type:String,
        required:true
    },
    Rare:{
        type:Number,
        required:true
    }
    
})

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    point: { type: Number},
    countdown_time: { type: Date },
    health:{type:Number},
    inventory:{
        type:[itemSchema],
        required:true
    }
});
const customer = mongoose.model("user",userSchema,"user");

export default customer;