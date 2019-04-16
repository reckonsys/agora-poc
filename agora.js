var client = AgoraRTC.createClient({mode: 'live', codec: "h264"});
client.init('d38fcc0725c84bf5b68693e5df0395a5', function () {
  console.log("AgoraRTC client initialized");
  client.join(null, 'bar', null, function(uid) {
    console.log("User " + uid + " join channel successfully");
    localStream = AgoraRTC.createStream({
      streamID: uid,
      audio: true,
      video: true,
      screen: false}
    );
    localStream.init(function() {
      console.log("getUserMedia successfully");
      localStream.play('agora_local');
      client.publish(localStream, function (err) {
        console.log("Publish local stream error: " + err);
      });

      client.on('stream-published', function (evt) {
        console.log("Publish local stream successfully");
      });
      client.on('stream-added', function (evt) {
        var stream = evt.stream;
        console.log("New stream added: " + stream.getId());

        client.subscribe(stream, function (err) {
          console.log("Subscribe stream failed", err);
        });
      });
      client.on('stream-subscribed', function (evt) {
        var remoteStream = evt.stream;
        console.log("Subscribe remote stream successfully: " + remoteStream.getId());
        //remoteStream.play('agora_remote' + remoteStream.getId());
        remoteStream.play('agora_remote');
      })

    }, function (err) {
      console.log("getUserMedia failed", err);
    });
  }, function(err) {
    console.log("Join channel failed", err);
  });
}, function (err) {
  console.log("AgoraRTC client init failed", err);
});
