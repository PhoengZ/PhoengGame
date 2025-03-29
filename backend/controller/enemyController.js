import enenmy from "../model/enemyModel.js";
import { getRandomInt } from "./randomInt.js";


export async function spwanMonster(req,res) {
    const Monster = await enenmy.find();
    const index = getRandomInt(0,Monster.length-1);
    res.status(200).json(Monster[index]);
}