const mongoose=require("mongoose")

const likeSchema=new mongoose.Schema({
    
  
postid:{
        type:String, 
    },
   uid:{
        type:String,
       
    },
    date:{
        type: Date,
        default: new Date(),
    }
   
})
const likeTable=new mongoose.model('likepost',likeSchema)
module.exports=likeTable