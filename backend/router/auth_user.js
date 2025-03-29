import express from "express";
import * as userController from "../controller/userController.js"

const public_user = express.Router();

public_user.get('/login',userController.Login);
public_user.post('/register',userController.Register);
public_user.get('/topscore',userController.getTop);
public_user.get('/getuser',userController.getUser);

export default public_user;