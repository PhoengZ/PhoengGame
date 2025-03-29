import express from "express";
import * as userController from "../controller/userController.js"

const public_user = express.Router();

public_user.get('/login',userController.Login);
public_user.post('/register',userController.Register);
public_user.get('/topscore',userController.getTop);
public_user.get('/getuser',userController.getUser);
public_user.get('/getinventory',userController.getInventory);
public_user.patch('/additem',userController.addInventory);
public_user.patch('/removeitem',userController.removeItem);
public_user.patch('/addtime',userController.addTime);

export default public_user;