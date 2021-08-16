const mongoose=require("mongoose")

const chatSchema=new mongoose.Schema({
    
  
    conversationId: {
        type: String,
      },
      senderId: {
        type: String,
      },
      text: {
        type: String,
      },
   
    date:{
        type: Date,
        default: new Date(),
    }
   
})
const chatingTable=new mongoose.model('chat',chatSchema)
module.exports=chatingTable