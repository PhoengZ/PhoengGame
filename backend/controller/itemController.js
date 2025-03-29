import item from "../model/itemModel.js";
import { getRandomInt } from "./randomInt.js";

export async function getRandomItem(req,res) {
    const allItem = await item.find();
    const idx = getRandomInt(0,allItem.length-1);
    res.status(200).json(allItem[idx]);
}
export async function getItem(req) {
    const found = await item.find({itemName:req});
    return found[0];
}