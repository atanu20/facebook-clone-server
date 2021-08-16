const mongoose =require("mongoose")

const userDetailsScheme=new mongoose.Schema({
   
    name:{
        type:String,
        require:true,
        trim:true
    },
    email:{
        type:String,
        require:true,
        unique:true,
        trim:true

    },
    password:{
        type:String,
        require:true,
        trim:true
    },
    date:{
        type:Date,
        default:Date.now
    }
})

const userDetailsTable=new mongoose.model('userDetail',userDetailsScheme);
module.exports =userDetailsTable