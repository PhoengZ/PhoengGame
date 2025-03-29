import User from "../model/userModel.js";

async function updateCountdownForUser(user) {
    const currentTime = new Date();
    const targetTime = new Date(user.countdown_time);
    const timeLeft = targetTime - currentTime;
    if (timeLeft <= 0) {
        console.log(`Countdown finished for user: ${user.username}`);
        await User.updateOne(
            { _id: user._id },
            { $set: { countdown_time: null } }
        );
    } else {
        const remainingTimeInSeconds = Math.floor(timeLeft / 1000);
        console.log(`User ${user.username} - Time left: ${remainingTimeInSeconds} seconds`);
        const newCountdownTime = new Date(currentTime.getTime() + remainingTimeInSeconds * 1000);
        await User.updateOne(
            { _id: user._id },
            { $set: { countdown_time: newCountdownTime } } 
        );
    }
}

export async function updateCountdownForAllUsers() {
    try {
        const users = await User.find({ countdown_time: { $ne: null } });
        users.forEach((user) => {
            updateCountdownForUser(user);
        });
    } catch (error) {
        console.error("Error updating countdown for users:", error);
    }
}

 