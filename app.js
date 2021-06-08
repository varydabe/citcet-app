//require the express module
require('custom-env').env(true);
const express = require("express");
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser");
const route = require("./src/route/route");
const ChatController = require('./src/controller/ChatController');

//require the http module
const http = require("http").Server(app);

// require the socket.io module
const io = require("socket.io");

const port = process.env.PORT || 5000;

//bodyparser middleware
app.use(bodyParser.json());

//cors
app.use(cors());

//routes
app.use("/", route);

//set the express.static middleware
app.use(express.static(__dirname + "/public"));
//app.set('view engine', 'ejs')

//integrating socketio
socket = io(http);

//setup event listener
socket.on("connection", socket => {
  console.log("user connected");

  socket.on("disconnect", function() {
    console.log("user disconnected");
  });

  //Someone is typing
  socket.on("typing", data => {
    socket.broadcast.emit("notifyTyping", {
      user: data.user,
      message: data.message,
      roomId: data.roomId
    });
  });

  //when someone stops typing
  socket.on("stopTyping", () => {
    socket.broadcast.emit("notifyStopTyping");
  });


  socket.on("chat message", function(room, data) {
    // join spesific room
    socket.join(room);

    if(data.message!=="__subscribe__") {
      //broadcast message to everyone in port:5000 except yourself.
      socket.in(data.roomId).emit("message", { message: data.message, senderName: data.senderName});

      //save chat to the database
      newMessage = {
        message: data.message,
        senderId: data.senderId,
        senderName: data.senderName,
        roomId: data.roomId
      }

      ChatController.sendMessage(newMessage);
    }

    console.log(data.message);
  });
});

http.listen(port, () => {
  console.log("Running on Port: " + port);
});