const router =require("express").Router();
// const {}
router.get("/",(req,res)=>{
    res.send({msg:"Meeting"})
})
module.exports=router