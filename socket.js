const users={}

const socket=(io)=>{
    io.on('connection',(socket)=>{
        // console.log(io.engine.clientsCount+" , connected , "+socket.id)
        console.log("Connected : "+socket.id)
        // if(!users[socket.id]===socket.id){
        //     users[socket.id].push(socket.id)
        //     console.log("1")
            socket.emit("your-id",socket.id)
        // }
        
        socket.on("message",(m)=>{
            socket.broadcast.emit('sendmsg',m)
        })
        socket.on("diconnect",()=>{
            console.log("disconnected")
        })
    })
}
module.exports =socket