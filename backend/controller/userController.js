import User from "../model/userModel.js";
import { getItem } from "./itemController.js";
export async function Login(req, res) {
    const { username, password } = req.query;
    const found = await User.find({ username, password });
    console.log(found.length);
    if (found.length == 1) {
        const Object = {
            username: username,
            loggedIn: true
        }
        res.status(200).json(Object);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
}
export async function Register(req, res) {
    const { username, password } = req.body;
    const foundUsername = await User.find({ username: username });
    if (foundUsername.length == 1) res.status(409).json({ message: "Username is already used" });
    let date = new Date();
    date.setDate(date.getDate() + 1);
    const newUser = new User({
        username: username,
        password: password,
        point: 0,
        countdown_time: date,
        health:100,
        inventory:[]
    });
    try {
        await newUser.save();
        res.status(200).json({ message: "Complete create user!" });
    } catch (error) {
        res.status(400).json({ message: "Login faild, ", error });
    }
}
export async function getUser(req,res){
    const {username} = req.query;
    const found = await User.find({ username});
    res.status(200).json(found[0]);
}
export async function getTop(req, res) {
    const find = await User.find().sort({ point: -1 }).limit(10)
    res.status(200).json(find);
}
export async function getInventory(req,res){
    const {username} = req.query;
    const user = await User.find({username})
    if (user.length == 0)res.status(400).json({message:"User not found!"});
    res.status(200).json(user[0].inventory);
}
export async function addInventory(req,res){
    const {username,itemName} = req.query;
    let user = await User.find({username})
    if (user.length == 0)res.status(400).json({message:"User not found!"});
    const item = await getItem(itemName);
    user[0].inventory.push(item);
    await user[0].save();
    res.status(200).json({message:"Success adding item!"})
}
export async function removeItem(req,res){
    const {username,itemName} = req.query;
    const user = await User.findOne({username});
    if (!user)res.status(200).json({message:"User is not exist!"});
    const newInventory = user.inventory.filter(item => item.itemName !== itemName);
    user.inventory = newInventory;
    await user.save();
    res.status(200).json({message:"Success removing!"})
}