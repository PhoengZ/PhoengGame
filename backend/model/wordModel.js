import mongoose from "mongoose";
const wordSchema = new mongoose.Schema({
    word:{
        type:String,
        required:true
    },
    meaning:{
        type:String,
        required:true
    }
    
});
const word = mongoose.model('word',wordSchema,'word');
export default word;