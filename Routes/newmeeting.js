const router =require("express").Router();
const uuid =require("uuid").v1
// const {}
router.get("/",(req,res)=>{
    ///->generate new room id
//     io.engine.generateId = (req) => {
//     return uuid.v4(); // must be unique across all Socket.IO servers
//   } 
const id=uuid()
    res.send({msg:"newMeeting",roomId:id})
})
module.exports=router