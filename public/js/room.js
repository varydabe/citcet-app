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
          var partner = data.member.split(',');
          partner = partner.filter((user) => {
            return user!==userId;
          })
          var li = document.createElement("li");
          var div = document.createElement("div");
          var h4 = document.createElement("h4");
          var span = document.createElement("span", );
          var p = document.createElement("p");

          li.setAttribute("id", "listRoom");
          div.setAttribute("id", "divRoom");
          h4.setAttribute("id", "partnerName");
          p.setAttribute("id", "message");
          span.setAttribute("id", "time");

          console.log(data);
          if(data.senderId===userId) {
            div.appendChild(h4).append(data.receiverName);
          }
          else {
            div.appendChild(h4).append(data.senderName);
          }
          div.appendChild(p).append(data.lastMessage);
          div.appendChild(span).append(formatTimeAgo(data.createdAt));
          li.appendChild(div);

          rooms.appendChild(li);

          div.onclick = function () {
            window.open(`/chat.html?roomId=${data.roomId}&senderId=${userId}`)
          }
        });
      });
})();