const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomSchema = new Schema(
    {
    roomId: {
        type: String
    },
    member: {
        type: String
    },
    senderId: {
        type: String
    },
    senderName: {
        type: String
    },
    receiverId: {
        type: String
    },
    receiverName: {
        type: String
    },
    lastMessage: {
        type: String
    }
  },
    {
        timestamps: true
    }
);

const Room = mongoose.model("room", roomSchema);

async function initRoom(data) {
    //check  if room already exist with the same member.
    try {
        var room = await Room.findOne({ member: data.member }, { __v: 0 });
    }
    catch (error) {
        return Promise.reject(error);
    }

    if (room) {
        return Promise.resolve(room);
    }

    const newRoom = {
        roomId: data.roomId,
        member: data.member,
        senderId: data.senderId,
        senderName: data.senderName,
        receiverId: data.receiverId,
        receiverName: data.receiverName,
        lastMessage: data.message
    };
    try {
        var result = await Room.create(newRoom);
        return Promise.resolve(result);
    }
    catch (error) {
        return Promise.reject(error);
    }

}

async function updateLastMessage(roomId, message) {
    try {
        await Room.updateOne({roomId: roomId},{ $set: { lastMessage: message } });
        return Promise.resolve();
    }
    catch (error) {
        return Promise.reject(error);
    }
}

async function getAllRooms(userId) {
    try {
        var rooms = await Room.find({ member: new RegExp(userId, 'i')}, { __v: 0 }).sort({ updatedAt: -1 });
    }
    catch (error) {
        return Promise.reject(error);
    }

    return Promise.resolve(rooms);
}

module.exports = { Room, initRoom, updateLastMessage, getAllRooms };
