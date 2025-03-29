import express ,{urlencoded} from "express";
import dotenv from "dotenv";
import cors from "cors";
import "./config/db.js";
import public_user from "./router/auth_user.js";
import enemy_public from "./router/enemy.js";
import item_public from './router/item.js';
import word_public from "./router/word.js";
import { updateCountdownForAllUsers } from "./controller/countdownController.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(urlencoded({extended:true}));

app.use('/user',public_user);
app.use('/enemy',enemy_public);
app.use('/item',item_public);
app.use('/word',word_public);
// async function startCountdownUpdates() {
//     console.log("Starting countdown updates for all users...");

//     // Call the function to update countdown for all users
//     setInterval(() => {
//         updateCountdownForAllUsers(); // Update countdown for all users every 1 second
//     }, 1000);
// }

// Initialize countdown on server startup
// startCountdownUpdates();

const port = 3002;

app.listen(port,()=>{
    console.log("Server start at port 3002");
})