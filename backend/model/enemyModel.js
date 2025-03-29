import mongoose from "mongoose";

const enemySchema = new mongoose.Schema({
    name: { type: String, required: true },
    health: { type: Number, default: 100 },
    attackPower: { type: Number, default: 10 }
});

const enenmy = mongoose.model("enemy",enemySchema,"enemy");
export default enenmy;