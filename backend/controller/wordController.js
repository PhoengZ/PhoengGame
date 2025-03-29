import word from "../model/wordModel.js";
import { getRandomInt } from "./randomInt.js";
export async function getrandomWord(req,res){
    const allword = await word.find();
    const idx = getRandomInt(0,allword.length-1);
    res.status(200).json(allword[idx]);
}