const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = new Schema(
  {
    message: {
      type: String
    },
    senderId: {
      type: String
    },
    senderName: {
      type: String
    },
    roomId: {
        type: String
    }
  },
  {
    timestamps: true
  }
);

let Chat = mongoose.model("chat", chatSchema);

async function getAllMessages(roomId) {
    try {
        var messages = await Chat.find({ roomId:roomId }).sort({ createdAt: 1 });
    }
    catch (error) {
        return Promise.reject(error);
    }

    return Promise.resolve(messages)
}

async function sendMessage(data) {
    const newMessage = {
        message: data.message,
        senderId: data.senderId,
        senderName: data.senderName,
        roomId: data.roomId
    }

    try {
        var messages = await Chat.create(newMessage);
    }
    catch (error) {
        return Promise.reject(error);
    }

    return Promise.resolve(messages)
}

module.exports = { Chat, getAllMessages, sendMessage };