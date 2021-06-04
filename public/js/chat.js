var socket = io();
var messages = document.getElementById("messages");
const paramsRoom = new URLSearchParams(location.search);
var roomId = paramsRoom.get("roomId").toString();
var senderId = paramsRoom.get("senderId").toString();


// CHAT
// Chat massages
//$("#messages").animate({scrollTop: $('#messages').prop("scrollHeight")}, 500);

!async function(){
  let user = await fetch(`/user?userId=${senderId}`)
      .then(data => {return data.json();})
      .then(json => {return json[0]})
      .catch(error => {
        console.error(error);
      });

  console.log(user);

  $("form").submit(function(e) {
    let li = document.createElement("li");
    var message = $("#message").val();
    var data = {
      message: message,
      senderId: user.userId,
      senderName: user.username,
      roomId: roomId
    }
    socket.emit("chat message",  data.roomId, data);

    messages.appendChild(li).append(message);
    let span = document.createElement("span");
    messages.appendChild(span).append("by " + data.senderName + ": " + "just now");

    $("#message").val("");
    $("#messages").animate({scrollTop: $('#messages').prop("scrollHeight")}, 500);
    // prevents page reloading
    e.preventDefault();
    return false;
  })
}();


(function() {
  socket.on("message", data => {
    let li = document.createElement("li");
    let span = document.createElement("span");
    messages.appendChild(li).append(data.message);
    messages.appendChild(span).append("by " + data.senderName + ": " + "just now");
    console.log(data);
    console.log("Hello bingo!");
    $("#messages").animate({scrollTop: $('#messages').prop("scrollHeight")}, 500);
  });
})();

// fetching initial chat messages from the database
(function() {
  var data = {};
  socket.emit("chat message",  data.roomId, data);

  fetch(`/messages?roomId=${roomId}`)
      .then(data => {
        return data.json();
      })
      .then(json => {
        json.map(data => {
          let li = document.createElement("li");
          let span = document.createElement("span");
          messages.appendChild(li).append(data.message);
          messages
              .appendChild(span)
              .append("by " + data.senderName + ": " + formatTimeAgo(data.createdAt));
        });
      });
})();



//$("#messages").animate({scrollTop: $('#messages').prop("scrollHeight")}, 600);

//is typing...

let messageInput = document.getElementById("message");
let typing = document.getElementById("typing");

//isTyping event
messageInput.addEventListener("keypress", () => {
  socket.emit("typing", { user: "Someone", message: "is typing..." });
});

socket.on("notifyTyping", data => {
  typing.innerText = data.user + " " + data.message;
});

//stop typing
messageInput.addEventListener("keyup", () => {
  socket.emit("stopTyping", "");
});

socket.on("notifyStopTyping", () => {
  typing.innerText = "";
});
