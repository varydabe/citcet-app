// FORM INIT ROOM
(function () {
    $("#form").submit(function(e) {
        var senderId = $("#senderId").val();
        var senderName = $("#senderName").val();
        var receiverId = $("#receiverId").val();
        var receiverName = $("#receiverName").val();

        fetch('/room', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            //make sure to serialize your JSON body
            body: JSON.stringify({
                senderId: senderId,
                senderName: senderName,
                receiverId: receiverId,
                receiverName: receiverName
            })
        }).then(data => {
            return data.json()
        }).then((response) => {
            window.open(response.url)
        }).catch(e => console.log(e));
        e.preventDefault();

        $("#form")[0].reset();
    });
})();

// FORM USER ID
(function () {
    $("#formUserId").submit(function(e) {
        var userId = $("#userId").val();

        e.preventDefault();

        window.open(`/room.html?userId=${userId}`);

        $("#formUserId")[0].reset();
    });
})();


