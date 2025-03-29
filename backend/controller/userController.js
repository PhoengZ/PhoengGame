import User from "../model/userModel.js";

export async function Login(req,res) {
    const {username,password} = req.body;
    const found = await User.find({username,password});
    console.log(found.length);
    if (found.length == 1){
        const Object = {
            username:username,
            loggedIn:true
        }
        res.status(200).json(Object);
    }else{
        res.status(404).json({message:'User not found'});
    }
}

export async function Register(req,res) {
    const {username,password} = req.body;
    const foundUsername = await User.find({username:username});
    if (foundUsername.length > 1)res.status(409).json({message:"Username is already used"});
    // console.log("Is in Register");
    let date = new Date();
    date.setDate(date.getDate() + 1);
    const newUser = new User({
        username:username,
        password:password,
        point:0,
        countdown_time: date,
    });
    try{
        await newUser.save();
        res.status(200).json({message:"Complete create user!"});
    }catch(error){
        res.status(400).json({message:"Login faild, ",error});
    }
}

export async function getTop(req,res) {
    const find = await User.find().sort({point:-1}).limit(5)
    res.status(200).json(find);
}