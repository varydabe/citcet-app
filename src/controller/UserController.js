const User = require("../models/User");



async function getUserById(req, res, next) {
    var userId = req.query.userId;

    res.setHeader("Content-Type", "application/json");
    res.statusCode = 200;

    try {
        var user = await User.getUserById(userId);

        return Promise.resolve(res.json(user));
    } catch (error) {
        return Promise.reject(error);
    }
}

async function saveUser(data) {
    try {
        var user = await User.getUserById(data.userId);
        console.log("ini user setelah save user get userbyId");
        console.log(user);
    }
    catch (error) {
        return Promise.reject(error);
    }

    if(user) {
        return Promise.resolve(user);
    }

    try {
        user = await User.saveUser(data);

        return Promise.resolve(user);
    } catch (error) {
        return Promise.reject(error);
    }
}

module.exports = { getUserById, saveUser }