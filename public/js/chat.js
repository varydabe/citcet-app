var socket = io();
var messages = document.getElementById("messages");
var title = document.getElementById("title");

const paramsRoom = new URLSearchParams(location.search);
var roomId = paramsRoom.get("roomId").toString();
var senderId = paramsRoom.get("senderId").toString();


// CHAT
// Chat massages
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
    let span = document.createElement("span");
    let div = document.createElement("div");
    let p = document.createElement("p");
    var message = $("#message").val();

    li.setAttribute("id", "li_sender");
    div.setAttribute("id", "div_sender");
    p.setAttribute("id", "message_sender");
    span.setAttribute("id", "span_sender");

    var data = {
      message: message,
      senderId: user.userId,
      senderName: user.username,
      roomId: roomId
    }
    socket.emit("chat message",  data.roomId, data);

    div.appendChild(p).append(data.message);
    div.appendChild(span)
        .append("by " + data.senderName + ": " + "just now");

    li.appendChild(div);
    messages.appendChild(li);

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
    let div = document.createElement("div");
    let p = document.createElement("p");

    li.setAttribute("id", "li_partner");
    div.setAttribute("id", "div_partner");
    p.setAttribute("id", "message_partner");
    span.setAttribute("id", "span_partner");

    div.appendChild(p).append(data.message);
    div.appendChild(span)
        .append("by " + data.senderName + ": " + "just now");

    li.appendChild(div);
    messages.appendChild(li);
    console.log("Hello bingo!");
    $("#messages").animate({scrollTop: $('#messages').prop("scrollHeight")}, 500);
  });
})();

// fetching initial chat messages from the database
(function() {
  var data = {message:"__subscribe__"};
  socket.emit("chat message",  roomId, data);

  fetch(`/messages?roomId=${roomId}`)
      .then(data => {
        return data.json();
      })
      .then(json => {
        json.map(data => {
          let li = document.createElement("li");
          let span = document.createElement("span");
          let div = document.createElement("div");
          let p = document.createElement("p");

          if(data.senderId!==senderId) {
            li.setAttribute("id", "li_partner");
            div.setAttribute("id", "div_partner");
            p.setAttribute("id", "message_partner");
            span.setAttribute("id", "span_partner");
          }
          else {
            li.setAttribute("id", "li_sender");
            div.setAttribute("id", "div_sender");
            p.setAttribute("id", "message_sender");
            span.setAttribute("id", "span_sender");
          }

          div.appendChild(p).append(data.message);
          div.appendChild(span)
              .append("by " + data.senderName + ": " + formatTimeAgo(data.createdAt));

          li.appendChild(div);
          messages.appendChild(li);
        });
      });
})();


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
