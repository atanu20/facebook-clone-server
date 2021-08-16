const mongoose =require("mongoose")

const notificationScheme=new mongoose.Schema({
   
    name:{
        type:String,
        require:true,
        trim:true
    },
    message:{
        type:String,
        require:true,
        
        trim:true

    },
    post_id:{
        type:String,
        
    },
    user_id:{
        type:String,
       
    },
    date:{
        type:Date,
        default:Date.now
    }
})

const notificationTable=new mongoose.model('notification',notificationScheme);
module.exports =notificationTable