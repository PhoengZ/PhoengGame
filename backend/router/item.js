import express from "express";
import * as itemController from "../controller/itemController.js"

const item_public = express.Router();

item_public.get('/randomitem',itemController.getRandomItem);
item_public.get('/getitem',itemController.getItem);

export default item_public;