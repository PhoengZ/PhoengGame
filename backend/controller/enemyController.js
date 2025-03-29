import enenmy from "../model/enemyModel.js";

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function spwanMonster(req,res) {
    const Monster = await enenmy.find();
    const index = getRandomInt(0,Monster.length-1);
    res.status(200).json(Monster[index]);
}