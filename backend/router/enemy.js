import express from "express";
import * as enemyController from "../controller/enemyController.js";


const enemy_public = express.Router();

enemy_public.get('/spawnMonster',enemyController.spwanMonster);

export default enemy_public;