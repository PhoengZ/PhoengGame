import mongoose, { mongo } from "mongoose";

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
    },
    Url:{
        type:String,
        required:true
    }
})

const item = mongoose.model('item',itemSchema,'item');

export default item;