import express from "express";
import * as wordController from "../controller/wordController.js"

const word_public = express.Router();

word_public.get('/randomword',wordController.getrandomWord);


export default word_public;