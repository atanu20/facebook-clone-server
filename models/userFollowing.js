const mongoose=require("mongoose")

const followSchema=new mongoose.Schema({
    
  
    u_id:{
        type:String, 
    },
   following_id:{
        type:String,
       
    },
   
    date:{
        type: Date,
        default: new Date(),
    }
   
})
const followingTable=new mongoose.model('following',followSchema)
module.exports=followingTable