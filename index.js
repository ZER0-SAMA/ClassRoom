const lc = new RTCPeerConnection() //local connection
const dc = lc.createDataChannel("channel")//data channel 
dc.onmessage=(e)=>{console.log("Just got a message"+e.data)}
dc.onopen=()=>{console.log("Connection opened!")}
lc.onicecandidate=e=>{console.log("New ice candidate ! repreinting SDP")+JSON.stringify(lc.localDescription)}
lc.createOffer().then(o=>lc.localDescription(o)).then(console.log("set successfully")) //createoffer  



//Party 2
// const offer={" "}
const rc = new RTCPeerConnection() //local connection
lc.onicecandidate=e=>{console.log("New ice candidate ! repreinting SDP")+JSON.stringify(lc.localDescription)}
rc.ondatachannel=e=>{
    rc.dc=e.channel
    rc.dc.onmessage=e=>console.log("new message  from client@"+e.data)
    rc.dc.onopen=e=>console.log("connection opened!")
}
rc.setRemoteDescription(offer).then(a=>console.log("offer set"))
rc.createAnswer().then(a=>rc.setLocalDescription(a)).then(a=>console.log("answer created"))

//party1
// const ans=""
// lc.setRemoteDescription(ans)
// dc.send("msg")