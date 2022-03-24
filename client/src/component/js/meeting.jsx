import React, { useEffect, useState, useRef } from 'react'
import "../css/meeting.css"
import CallEnd from "../assets/call-end.png"
import Emoji from "../assets/emoji.png"
import MicMute from "../assets/mic-mute.png"
import Mic from "../assets/mic.png"
import Send from "../assets/send.png"
import User from "../assets/user.png"
import VideoOff from "../assets/video-off.png"
import VideoOn from "../assets/video-on.png"
import ZoomIn from "../assets/zoom-out.png"
import ZoomOut from "../assets/zoom-in.png"
import NewMeeting from './newMeeting'
import { io } from "socket.io-client";
import Peer from "simple-peer" 

// const messageArea = document.querySelector('.message-area')
// let userDiv = document.createElement('div')
// let markup = `
// <div >${val.user}</div>
// <p>${val.room}</p>
//  `
// userDiv.innerHTML = markup
// messageArea.append(userDiv)



const Video = (props) => {
    const ref = useRef();
    const count=useRef(0);
    console.log("Props : "+props.peer)
    useEffect(() => {
        props.peer.on("stream", stream => {
            ref.current.srcObject = stream;
            // count.current=count.current+1
            // console.log(JSON.stringify(props.peer))
        })
        // props.peer.on('close',()=>{console.log("Peer")})

    }, []);

    return (
        // id={`${props.peer}`}
        <video className='screens' playsInline autoPlay ref={ref} />

        
    );
}


function Meeting(val) {

    const [mainuserscreen, setMainuserscreen] = useState(false) //check here!
    const [vide, setVide] = useState(false) //check here
    const [mic, setMic] = useState(false)
    const [zoom, setZoom] = useState(false)
    const [call, setCall] = useState(false)
    const [valid, setValid] = useState(true)
    const [username, setUsername] = useState('')
    const [peers, setPeers] = useState([])
    const socket = useRef()
    const uservideo = useRef()
    const peersRef = useRef([])
    const myid = useRef()
    const temp = useRef(true)
    const temp2 = useRef(true)
    const s = useRef()
    const pr =useRef()
    const change =useRef(0)
    const whichRoom=useRef()



    async function calli() {
        const res = await fetch("http://localhost:8080/meeting")
        const resjson = await res.json()
        console.log(resjson)
        setValid(!val)
    }

    // async function connection() {
    //     pr.current =new RTCPeerConnection();
    //     const offer = await pr.current.createOffer()
    //     await pr.current.setLocalDescription(offer)
    //     console.log("lc desc : "+JSON.stringify(pr.current.localDescription))
    //     // console.log(pr.current)
    //     // socket.current.emit("peerconnection",offer)
    //     // socket.current.on
    //     const j=await val.room
      
    // }

    const messageArea = document.querySelector('.message-area')
    useEffect(() => {
        // const roomID = props.match.params.roomID;
        // console.log("Room ID : "+val.room)
        whichRoom.current=val.room
        // console.log("whichRoom : "+ whichRoom.current)
        setVide(val.pro)
        setMic(val.pro)
        setMainuserscreen(val.pro)
        setUsername(val.user)
        console.log(val.user)
        // socketinstance();


        socket.current = io("http://localhost:8080/");                   //socket 
        socket.current.on("connect", () => {
            console.log(val.user + " connected "+" RoomID : "+ val.room)
      
        
            // let room=val.room
            // let username=val.user

            // socket.current.emit("user-joined-chat",{username,room})
            // socket.current.on("disconnected",username=>{
            //     var elem = document.getElementById('dummy');
            //     elem.parentNode.removeChild(elem);
            //     // return false;
            //     change.current+=1;
            //     const messageArea = document.querySelector('.message-area')
            //     let userDiv = document.createElement('div')
            //     let className='user-joined-chat'
            //     userDiv.classList.add(className)
            //     let markup = `
            //     <div  >${username} left</div>
                
            //      `
            //  userDiv.innerHTML = markup
            //     messageArea.append(userDiv)
            //     // <p>Room ID : ${val.room}</p>
            // })
    //    connection()

        socket.current.on("your-id", (d) => {      //my id
            console.log("Your Id = " + d)
            myid.current = d

        })
        })

   

        calli()
        if (!val.pro) {
            window.location.replace("http://localhost:3000/dashboard/new")  ///to not able to access without creating meeting
        }
        if (!mainuserscreen) {

            const constraints = {
                'audio': { 'echoCancellation': true },
                'video': {
                    'width': 5000,
                    'height': 500
                }
            }
            navigator.mediaDevices.getUserMedia(constraints).then((stream) => { //accessing media
                console.log("Accessing!! : "+ stream)

                uservideo.current.srcObject = stream;
                      let room=val.room
            let username=val.user

                
                socket.current.emit("join room",{ room,username});
                socket.current.on("all-users", users => {
                    console.log("Users : "+users)
                    const peers = [];
                    users.forEach(userID => {
                     

                        const peer = createPeer(userID, socket.current.id, stream);
                        console.log("Peer : "+JSON.stringify(peer))
                        peersRef.current.push({
                            peerID: userID,
                            peer,
                        })
                        peers.push({
                            peerID: userID,
                            peer,
                        });
                       
                    })
                    console.log("peers"+peers)
                    setPeers(peers);
                })
    
                socket.current.on("user joined", payload => {
                         const messageArea = document.querySelector('.message-area')
                let userDiv = document.createElement('div')
                let className='user-joined-chat'
                userDiv.classList.add(className)
                let markup = `
                <div  >${payload.callerID} joined</div>
                
                 `
             userDiv.innerHTML = markup
                messageArea.append(userDiv)
                    console.log("user joined :"+payload)
                    const peer = addPeer(payload.signal, payload.callerID, stream);
                    peersRef.current.push({
                        peerID: payload.callerID,
                        peer,
                    })
                   const peerObj={
                       peer,
                       peerID:payload.callerID
                    };

                    setPeers(users => [...users, peerObj]);
                });
    
                socket.current.on("receiving returned signal", payload => {
                    const messageArea = document.querySelector('.message-area')
                    let userDiv = document.createElement('div')
                    let className='user-joined-chat'
                    userDiv.classList.add(className)
                    let markup = `
                    <div  >${payload.id} joined</div>
                    
                     `
                 userDiv.innerHTML = markup
                    messageArea.append(userDiv)

                    console.log("receiving returned signal :"+payload)
                    const item = peersRef.current.find(p => p.peerID === payload.id);
                    item.peer.signal(payload.signal);
                });
        

                socket.current.on("user-left",id=>{
                    console.log("user left!!!!!!!!!!!!!!!!!!!!!!!!!!!")
                    const messageArea = document.querySelector('.message-area')
                    let userDiv = document.createElement('div')
                    let className='user-joined-chat'
                    userDiv.classList.add(className)
                    let markup = `
                    <div  >${id} Left</div>
                    
                     `
                 userDiv.innerHTML = markup
                    messageArea.append(userDiv)
        
                    const peerObj=peersRef.current.find(p=>p.peerID===id);
                    if(peerObj){peerObj.peer.destroy();}
                    const peers=peersRef.current.filter(p=>p.peerID!==id);
                    peersRef.current=peers;
                    setPeers(peers);
                })
        


            })
                // .catch(error => {
                //     console.error('Error accessing media devices.', error);
                // }
                // )
        }

        //Incoming message
        const messageAre = document.querySelector('.message-area')
        socket.current.on('sendmsg', (mssg) => {
            console.log(mssg)
            let mainDiv = document.createElement('div')
            let className = "income-msg"
            mainDiv.classList.add(className)

            let markup = `
                   <div class="Name-in">${mssg.username}</div>
                   <p id="msg-data">${mssg.msg}</p>
                        `
            mainDiv.innerHTML = markup
            messageAre.appendChild(mainDiv)
            // scrollToBottom()
            

        })
       
    }, [])
    // change.current
//check here for problem
    function createPeer(userToSignal, callerID, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream, 
        });

        peer.on("signal", signal => {
            console.log("Create Peer : "+ signal)
            socket.current.emit("sending signal", { userToSignal, callerID, signal }) //signal contains the data related to offer ,answer and ice candidates of peer
        })

        return peer;
          }

    function addPeer(incomingSignal, callerID, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })

        peer.on("signal", signal => {
            console.log("Add Peer : "+ signal)
            socket.current.emit("returning signal", { signal, callerID })
        })

        peer.signal(incomingSignal);

        return peer;
    }


    function streaming() {
        setVide(!vide)
       
        temp.current = !temp.current

        uservideo.current.srcObject.getTracks()[1].enabled = temp.current
        console.log(uservideo.current.srcObject.getTracks()[1])

    }
    function unmute() {
        console.log(mic)
        setMic(!mic)
        temp2.current = !temp2.current
        uservideo.current.srcObject.getTracks()[0].enabled = temp2.current
        console.log(uservideo.current.srcObject.getTracks()[0].enabled)
      
        

    }


    function zoomsize() {
        setZoom(!zoom)
        const newconstraints = {
            width: 1200,
            height: 720
        }
        if (!zoom) {
            const track = uservideo.current.srcObject.getVideoTracks()[0];
            track.applyConstraints(newconstraints)
                .then(() => {
                    // Do something with the track such as using the Image Capture API.
                    console.log("zoomed")
                })
                .catch(e => {
                    console.log("error")
                    // The constraints could not be satisfied by the available devices.
                });
        }
        else {
            const previousconstraints = {
                width: 5000,
                height: 500
            }
            const track = uservideo.current.srcObject.getVideoTracks()[0];
            track.applyConstraints(previousconstraints)
                .then(() => {
                    // Do something with the track such as using the Image Capture API.
                    console.log("zoomed")
                })
                .catch(e => {
                    console.log("error")
                    // The constraints could not be satisfied by the available devices.
                });

        }
    }



    


    function sendmsg() {
        const data = {
            username: username,
            msg: document.getElementById("msg").value,
            id: myid.current
        }
        document.getElementById("msg").value = ""
        console.log("Sending data : " + data)


        // Append message
        appendMessage(data, 'outgoing-msg');
        //send to server
        socket.current.emit("message", data)
    }

    //////
    function appendMessage(msg, type) {
        let mainDiv = document.createElement('div')
        let className = type
        mainDiv.classList.add(className)
        let markup = `
                   <div class="Name-out">${msg.username}</div>
                   <p id="msg-data">${msg.msg}</p>
        `
        mainDiv.innerHTML = markup
        messageArea.appendChild(mainDiv)
        // scrollToBottom()
    }



    ////////////End Call///////////
    function endcall() {
        socket.current.on("disconnect", (reason) => {
            console.log("disconnected : " + socket.current.id)
            console.log("Connection : " + socket.current.connected)
        })
        socket.current.disconnect()
        // console.log(
            uservideo.current.srcObject.getTracks()[0].stop()
            uservideo.current.srcObject.getTracks()[1].stop()
            // pr.current.close()
        setCall(!call)
        
    }


    return (<>{call ?
        <NewMeeting /> :
        <div className="Main-app">
            <div className='media'>
            <span float="left">${val.room}</span>
                <div className='main-screen'>
                    <div className='main-screen-user'>
                        {/* {mainuserscreen ?   */}
                        <video id="localVideo" ref={uservideo} autoPlay   >
                            <img src={User} alt="User" />
                        </video>
                        {/* playsinline controls="false" */}
                    </div>
                    
                    <div className='main-screen-btns'>
                        {vide ? <img alt="icons" id="icons" onClick={streaming} src={VideoOn} style={{ height: '20px', width: '25px', margin: '10px 5px 10px 10px', float: 'left', cursor: 'pointer' }} /> : <img alt="icons" onClick={streaming} id="icons" src={VideoOff} style={{ height: '20px', width: '25px', margin: '10px 5px 10px 10px', float: 'left', cursor: 'pointer' }} />}

                        {mic ? <img alt="icons" id="icons" onClick={unmute} src={Mic} style={{ height: '20px', width: '15px', margin: '10px 5px 10px 10px', float: 'left', cursor: 'pointer' }} /> :
                            <img alt="icons" onClick={unmute} id="icons" src={MicMute} style={{ height: '20px', width: '18px', margin: '10px 5px 10px 10px', float: 'left', cursor: 'pointer' }} />}


                        <img alt="icons" id="icons" onClick={endcall} src={CallEnd} style={{ height: '40px', width: '40px', cursor: 'pointer' }} />
                        {zoom ? <img alt="icons" id="icons" onClick={zoomsize} src={ZoomOut} style={{ height: '20px', width: '20px', margin: '10px 10px 10px 0px', float: 'right', cursor: 'pointer' }} /> : <img alt="icons" onClick={zoomsize} id="icons" src={ZoomIn} style={{ height: '20px', width: '20px', margin: '10px 10px 10px 0px', float: 'right', cursor: 'pointer' }} />}
                    </div>



                </div>


                <div className='other-screens-list'>
                {peers.map((peer) => {
                return (
                    <><Video key={peer.peerID} peer={peer.peer} /></>
                    
                );
                 })}


                </div>
            </div>
            <div className='chat'>
                <div className='chat-app'>
                    <div className='chat-header'>
                        <h1>Group-chat</h1>
                    </div>
                    <div className='message-area'>
                        {/* <div className='income-msg'><div className='Name-in'>Nikhil</div><p id="msg-data">cdsacda vfdvfd vfdvfd vfd vdfvfd  wvfdvdf  vfdvfdv vfd vf sdcscds cd vd v fdv dfvfd v dvfdvfdvfdvfdvd vdv fdvdfv vfdvd vfdv scasc dsacda vfdvfd vfdvfd vfd vdfvfd  wvfdvdf  vfdvfdv vfd vf sdcscds cd vd v fdv dfvfd v dvfdvfdvfdvfdvd vdv fdvdfv vfdvd vfdv scasc</p></div>
                        <div className='outgoing-msg'><div className='Name-out'>rahul</div><p id="msg-data">cdsacdacds  vdfvdfv vfdqregrg scasc</p></div> */}
                    </div>
                    <div className='text-area'>
                        <img src={Emoji} style={{ height: '25px', width: '25px', margin: '0 0 0 5px', cursor: 'pointer' }} alt="send" id="icons" />
                        <input id='msg' type="text" />
                        <img src={Send} style={{ height: '25px', width: '30px', margin: '0 5px 0 0', cursor: 'pointer' }} alt="send"
                            onClick={sendmsg}
                        />
                    </div>
                </div>
            </div>



        </div>
    }
    </>
    )
}

export default Meeting

