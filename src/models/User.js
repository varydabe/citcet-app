const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
    userId: {
      type: String
    },
    username: {
        type: String
    }
  }
);

const User = mongoose.model("user", userSchema);

async function getUserById(userId) {
    try {
        var user = await User.find({ userId: userId });
        return Promise.resolve(user);
    }
    catch (error) {
        return Promise.reject(error);
    }
}

async function saveUser(data) {
    const newUser = {
        userId: data.userId,
        username: data.username,
    }

    try {
        var existUser = await User.find({userId: data.userId});
    }
    catch (error) {
        return Promise.reject(error);
    }

    if (existUser.length !== 0) {
        return Promise.resolve(existUser);
    }

    try {
        var user = await User.create(newUser);
        return Promise.resolve(user)
    }
    catch (error) {
        return Promise.reject(error);
    }
}

module.exports = { User, getUserById, saveUser };