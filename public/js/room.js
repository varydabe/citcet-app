var socket = io();
var messages = document.getElementById("messages");
var rooms = document.getElementById("rooms");

// INDEX (ROOM)
// fetching rooms
(function () {
  const params = new URLSearchParams(location.search);
  var userId = params.get("userId").toString();

  fetch(`/room?userId=${userId}`)
      .then(data => {
        return data.json();
      })
      .then(json => {
        json.map(data => {
          var li = document.createElement("li");
          var btn = document.createElement("btn");
          var span = document.createElement("span", );
          var p = document.createElement("p");

          var partner = data.member.split(',');
          partner = partner.filter((user) => {
            return user!==userId;
          })
          btn.appendChild(li).append(partner);
          rooms.appendChild(btn);
          rooms.appendChild(p).append(data.lastMessage);
          rooms.appendChild(span).append("by " + formatTimeAgo(data.createdAt));

          btn.onclick = function () {
            window.open(`/chat.html?roomId=${data.roomId}&senderId=${userId}`)
          }
        });
      });
})();