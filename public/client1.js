// var pc =RTCPeerConnection(config) //config contain information about STUN,TURN
// var lcdes;
var lc;
var dc;
var rc;
var ans;
var offer;
async function meeting(){
     lc = new RTCPeerConnection() //local connection
    // dc = lc.createDataChannel("channel")//data channel 
    // dc.onmessage=(e)=>{console.log("Just got a message"+e.data)}
    // dc.onopen=()=>{console.log("Connection opened!")}
    console.log( "1st"+lc)
    lc.onicecandidate=e=>{
  
            console.log("New ice candidate ! repreinting SDP")+JSON.stringify(lc.localDescription)

    }


   const of= await lc.createOffer()
  await lc.setLocalDescription(of);
  console.log(JSON.stringify(lc.localDescription))


    console.log(lc.localDescription.type+ typeof lc.localDescription.type)
    console.log(typeof lc.localDescription)
    console.log( lc.localDescription)

    document.getElementById("Link").value=JSON.stringify(lc.localDescription)
    console.log(document.getElementById("Link").value)
    console.log(typeof document.getElementById("Link").value)
    // console.log( "2nd"+lc)
}



function copy(){
    copyText=document.getElementById("Link")
    copyText.select(); //select input
    navigator.clipboard.writeText(copyText.value);//copy text to clipboard
    console.log(offer.type)
    alert("copied")
}


async function join(){
    offer=JSON.parse(document.getElementById("pasted").value)
    console.log(typeof offer)
    // offer=JSON.stringify(offer) JSON.stringify(offer.type)
    console.log("offer = "+offer.type)
    rc = new RTCPeerConnection() //local connection
    rc.onicecandidate=e=>{console.log("New ice candidate ! repreinting SDP remote ")+JSON.stringify(rc.localDescription)}
    // rc.ondatachannel=e=>{
    //                     rc.dc=e.channel
    //                     rc.dc.onmessage=e=>console.log("new message  from client@"+e.data)
    //                     rc.dc.onopen=e=>console.log("connection opened!")
    //                     }   
    await rc.setRemoteDescription(offer)
    console.log("offer set" + rc.remoteDescription)
    rc.createAnswer().then(a=>rc.setLocalDescription(a)).then(()=>{ ans=JSON.stringify(rc.localDescription)
                                                                    console.log("answer created"+"joined"+ans)                                               
                                                                    document.getElementById("Link").value=JSON.stringify(rc.localDescription)
                                                                   
                                                                })

    
                                                                
}
function msg1(){
    dc.send("msg")
}
function join2(){
    offer=JSON.parse(document.getElementById("pasted2").value)
    console.log(typeof offer)
    // offer=JSON.stringify(offer) JSON.stringify(offer.type)
    console.log("offer = "+offer.type + offer)
    lc.setRemoteDescription(offer)
    

    ////
    dc = lc.createDataChannel("channel")//data channel 
    rc.ondatachannel=e=>{
        rc.dc=e.channel
      
        }  

    // rc.ondatachannel=e=>{
    //     rc.dc=e.channel
    //     rc.dc.onmessage=e=>console.log("new message  from client@"+e.data)
    //     rc.dc.onopen=e=>console.log("connection opened!")
    //     }


    dc.send("msg")
    dc.onmessage=(e)=>{console.log("Just got a message"+e.data)}
    dc.onopen=()=>{console.log("Connection opened!")}
    rc.dc.onmessage=e=>console.log("new message  from client@"+e.data)
    rc.dc.onopen=e=>console.log("connection opened!")
}
// function msg2(){
    
// }
// function msg3(){
    
// }
// msg1();
// msg2();
// msg3();