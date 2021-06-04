const Chat = require("../models/Chat");
const Room = require("../models/Room");
const RoomController = require("../models/Room");

function renderChatPage(req, res, next) {
    return res.redirect('/chat.html');
}

async function getAllMessages(req, res, next) {
    var roomId = req.query.roomId;

    res.setHeader("Content-Type", "application/json");
    res.statusCode = 200;
    try {
        var messages = await Chat.getAllMessages(roomId);

        return Promise.resolve(res.json(messages));
    } catch (error) {
        return Promise.reject(error);
    }
}

async function sendMessage(data) {
    try {
        var message = await Chat.sendMessage(data);
        //console.log(data);
        await RoomController.updateLastMessage(data.roomId, data.message)

        //return Promise.resolve(message);
    } catch (error) {
        return Promise.reject(error);
    }
}

module.exports = { getAllMessages, sendMessage, renderChatPage }