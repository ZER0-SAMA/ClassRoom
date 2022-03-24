import React ,{useState,useEffect,useRef}from 'react'
import '../css/newmeeting.css'
import Meeting from './meeting'
function NewMeeting() {
    const [username,setUsername] = useState('')
    const [valid,setValid]=useState(false)
    const [validroom,setValidroom]=useState('')
     const resjson=useRef()
     const conroom=useRef()
   
async function StartMeeting(){  
  
        if(!username||username=="username required"){
            setUsername("username required")
            setValid(false)
        }
        else{
            const res = await fetch("http://localhost:8080/new")  
            const resans=await res.json()
            resjson.current=resans.roomId
          
            console.log("New RoomId : "+resjson.current)
                if(resjson.current){
                    setValid(true)
                    setValidroom("yes")
                }
        }


}
async function JoinMeeting(){
    
    if(!username||username=="username required"){
        setUsername("username required")
        setValid(false)
    }
    else{
        conroom.current={
        type:"join",
        joinRoom:document.getElementById('join-meeting-link').value
    } 
        if(conroom.current.joinRoom){
        setValid(true);
        resjson.current=conroom.current.joinRoom
        setValidroom("yes")
        }
        else{

            setValidroom("Room Id required !!!")
            console.log(validroom)

        }

    }


            

    
}


    return (<>{(valid&&username&&username!="username required"&&validroom=="yes")?<Meeting pro={valid} user={username} room={resjson.current} />:

            
             <div className='new-meeting'>
                 {username?
        <span id="new-meeting-column">
            {
            username!="username required" ?
            <span id="username-set">{username}</span> 
            :
            <span id="new-meeting-column">
            <span>{username}</span>
        
            <input id="username" placeholder='Username' /> 
            <button id="new-meeting-btns"  onClick={()=>{setUsername(document.getElementById('username').value)}}>Submit</button>
       
            </span>

            }    
            </span>:
          
        <span id="new-meeting-column">
        <input id="username" placeholder='Username' /> 
        <button id="new-meeting-btns"  onClick={()=>{setUsername(document.getElementById('username').value)}}>Submit</button>
            
        </span>
}
        <span id="new-meeting-column">
        <input id="new-meeting-link" placeholder='My Meeting Id'/> 
        <button id="new-meeting-btns" onClick={StartMeeting}>New Meeting</button>

        </span>
        {
                validroom!="yes"?
                <span >{validroom}</span> :
            <> </>
            }
        <span id="new-meeting-column">
        <input id="join-meeting-link" placeholder='Meeting Id'/>
        <button id="new-meeting-btns" onClick={JoinMeeting}>Join</button>

        </span>
    </div>
    }
    </>
    )
}

export default NewMeeting










