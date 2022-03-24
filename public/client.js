const offer = await peerConnection.createOffer();
await peerConnection.setLocalDescription(offer);

const roomWithOffer = {
    offer: {
        type: offer.type,
        sdp: offer.sdp
    }
}
const roomRef = await db.collection('rooms').add(roomWithOffer);
const roomId = roomRef.id;
document.querySelector('#currentRoom').innerText = `Current room is ${roomId} - You are the caller!`















































var stream;
function hasUserMedia() { 
   //check if the browser supports the WebRTC 
   return !!(navigator.getUserMedia || navigator.webkitGetUserMedia || 
      navigator.mozGetUserMedia); 
} 

if (hasUserMedia()) { 
   navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
      || navigator.mozGetUserMedia; 
		
   //enabling video and audio channels 
   navigator.getUserMedia({ video: true, audio: true }, function (s) { 
      var video = document.querySelector('video'); 
		stream=s
      //inserting our stream to the video tag     
      video.srcObject = s
      console.log(stream.getTracks())
      console.log(video.srcObject)
   }, function (err) {}); 
} else { 
   alert("WebRTC is not supported"); 
}
const a =true
function mute(){
   // stream.getTracks().
   console.log("I clicked")
   // stream.getTracks()[0].endabled=false
   stream.getAudioTracks()[0].enabled = !(stream.getAudioTracks()[0].enabled);
   console.log(stream.getTracks()[0].muted)
}

