const express = require('express');
const { nanoid } = require('nanoid');
const bodyParser = require("body-parser");
const connectdb = require("../../dbconnect");
const Chats = require("../models/Chat");
const ChatController = require('../controller/ChatController')
const Room = require("../models/Room");
const RoomController = require('../controller/RoomController')
const UserController = require("../controller/UserController");

const router = express.Router();

router.route("/chat").get(ChatController.renderChatPage);
router.route("/messages").get(ChatController.getAllMessages);
router.route("/room").post(RoomController.initRoom);
router.route("/room").get(RoomController.getAllRooms);
router.route("/user").get(UserController.getUserById);
router.route("/admin").get(RoomController.renderAdminPage);

module.exports = router;
