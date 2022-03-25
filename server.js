const express=require("express")
const app = express()
const server =require("http").createServer(app)
const PORT = process.env.PORT ||8080
const meeting =require('./Routes/meeting')
const login =require('./Routes/login')
const dashboard =require('./Routes/dashboard')
const home =require('./Routes/home')
const newmeeting=require('./Routes/newmeeting')
const cors =require('cors')
const uuid = require("uuid");
const path =require("path")
// const { RTCPeerConnection, RTCSessionDescription } = window;

const users= new Map()
const u = {};

const socketToRoom = {};
////////peerconnection/////////////
// var pc = RTCPeerConnection(config);
// var answer;
// async function connection(offer){
//    await sc.setRemoteDescription(offer)
//    console.log("Remote Description"+sc.remoteDescription)
//    answer=await sc.createAnswer()
//    await sc.setLocalDescription(answer);
//    console.log("answer : "+ sc.localDescription)
// }

//////////////////////Socket////////////////////////////////////
const socket = require('socket.io')
const io=new socket.Server(server,{ //io server instance
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }})

// require('./socket')(io)
io.on('connection',(socket)=>{
    // console.log(io.engine.clientsCount+" , connected , "+socket.id)
    console.log("Connected : "+socket.id)
    // if(!users[socket.id]===socket.id){
    //     users[socket.id].push(socket.id)
    //     console.log("1")
       
    // }
    /////////////////////////////////////////////////////////////////////////////////////
    // socket.on("user-joined-chat",data =>{
    //     io.to(data.room).emit("userjoinedchat",data.username);
    //     // socket.broadcast.emit()
    // })
    socket.on("join room", roomID => {
        if (u[roomID.room]) {
            const length = u[roomID.room].length;
            if (length === 5) {
                socket.emit("room full");
                return;
            }
            u[roomID.room].push(socket.id);

    //     io.to(data.room).emit("userjoinedchat",data.username);
        // socket.broadcast.emit(roomID.username)

        } 
        else {
            u[roomID.room] = [socket.id];//CHECK
           
        }
        // console.log(u[roomID])
        socketToRoom[socket.id] = roomID.room;
        const usersInThisRoom = u[roomID.room].filter(id => id !== socket.id);//WHO CREATED THE ROOM SHOULD NOT BE IN THE ROOM
        console.log("user in this room : "+usersInThisRoom)

        socket.emit("all-users", usersInThisRoom);
    });


    socket.on("sending signal", payload => {
        io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
    });

    socket.on("returning signal", payload => {
        io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
    });
////////////////////////////////////////////////////////////////////////////////////////



    socket.on("peerconnection",offer=>{
        console.log(offer)
        // connection(offer)
    })
    
    // socket.emit("remotedescription",answer)
    socket.on("myself",(data)=>{
       
        if(!users.has(socket.id)){
            users.set(socket.id,data)
            // io.emit("join-room",users.get(socket.id)) 

        }
        console.log(socket.id +":"+ users.get(socket.id))
        console.log("room size :"+users.size)
    })
    
    socket.emit("your-id",socket.id)
    
    socket.on("message",(m)=>{
        socket.broadcast.emit('sendmsg',m)
        
    })

    socket.on("disconnect",()=>{
        
        console.log("disconnected : "+users.get(socket.id))
        
        // users.delete(socket.id)
      
        console.log("After disconnection room size : "+users.size)
        const roomID = socketToRoom[socket.id];
        let room = u[roomID];
        if (room) {
            room = room.filter(id => id !== socket.id);
            u[roomID] = room;
        }
        console.log("Broadcasting : "+socket.id);
        console.log(u[roomID]);
        // socket.emit("all-users", u[roomID]); //testing
        
        socket.broadcast.emit("user-left",socket.id);
       
    })
})



app.use(cors({
    origin:'*',
    credentials:true
}))
app.use(express.static(__dirname+'/public'))
app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/index.html")
    
})
// app.use("/",home)
// app.use("/login",login)
// app.use("/dashboard",dashboard)
app.use("/meeting",meeting)
app.use("/new",newmeeting)






     

if(process.env.NODE_ENV==='production'){
    app.use(express.static('client/build'))
    app.get("*", function (request, response) {
        response.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
      });
}
server.listen(PORT,()=>{
    console.log(`Server is lsitening at ${PORT}`)
})




 
/////connection error
// io.engine.on("connection_error", (err) => {
//     console.log(err.req);      // the request object
//     console.log(err.code);     // the error code, for example 1
//     console.log(err.message);  // the error message, for example "Session ID unknown"
//     console.log(err.context);  // some additional error context
//   });


// fir-rtc-4dd75