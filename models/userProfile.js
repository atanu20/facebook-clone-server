const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    profilePicture: {
      type: String,
      default: "",
    },
    coverPicture: {
      type: String,
      default: "",
    },
    
    
    desc: {
      type: String,
      max: 100,
      default: "Write your Description",
    },
    worked: {
      type: String,
      max: 100,
      default: "Worked as ?",
    },
    address: {
      type: String,
      max: 150,
      default: "Write your Address",
    },
    
    relationship: {
      type: String,
      default: "Relationship status ?",
      
    },
   
    userID:{
        type: String,
        unique:true
    }
  });

const userProfileTable=new mongoose.model('userProflie',UserSchema);
module.exports =userProfileTable
