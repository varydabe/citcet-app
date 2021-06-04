const { nanoid } = require('nanoid');
const Room = require("../models/Room");
const Chat = require("./ChatController");
const UserController = require("./UserController");

async function initRoom(req, res, next) {
    var senderId = req.body.senderId;
    var senderName = req.body.senderName;
    var receiverId = req.body.receiverId;
    var receiverName = req.body.receiverName;
    var roomId = nanoid(10);
    var message = "Hello!";

    var listMember = [];
    listMember.push(senderId, receiverId);

    listMember = listMember.sort().toString();

    var data = {
        roomId: roomId,
        senderId: senderId,
        senderName: senderName,
        receiverId: receiverId,
        receiverName: receiverName,
        message: message,
        member: listMember
    }

    // Save User
    try {
        // sender
        await UserController.saveUser({userId: senderId, username: senderName});
        // receiver
        await UserController.saveUser({userId: receiverId, username: receiverName});
    }
    catch (error) {
        return Promise.reject(error);
    }

    res.setHeader("Content-Type", "application/json");
    res.statusCode = 200;

    try {
        var room = await Room.initRoom(data);
        await Chat.sendMessage(data);

        const url = `/chat.html?roomId=${room.roomId}&senderId=${room.senderId}`;
        console.log(url);

        return Promise.resolve(res.json({url: url}));
    }
    catch (error) {
        return Promise.reject(error);
    }

}

async function updateLastMessage(roomId, message) {
    try {
        await Room.updateLastMessage(roomId, message);

        return Promise.resolve();
    }
    catch (error) {
        return Promise.reject(error);
    }
}

async function getAllRooms(req, res, next) {
    var userId = req.query.userId;

    try {
        var rooms = await Room.getAllRooms(userId);
    }
    catch (error) {
        return Promise.reject(error);
    }

    return Promise.resolve(res.json(rooms));
}


module.exports = {initRoom, updateLastMessage, getAllRooms}