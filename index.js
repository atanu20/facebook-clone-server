const PORT=process.env.PORT || 9000


const io = require("socket.io")(PORT, {
    cors: {
      origin: "*",
    },
  });
  
  let users = [];
  
  const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
      users.push({ userId, socketId });
  };
  
  const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
  };
  
  const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
  };
  
  io.on("connection", (socket) => {
    //when ceonnect
    console.log("a user connected.");
//   console.log(user)
    //take userId and socketId from user
    socket.on("addUser", (userId) => {
      addUser(userId, socket.id);
      io.emit("getUsers", users);
    });
  
    //send and get message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
      const user = getUser(receiverId);
      // console.log(user)
      // console.log(senderId + "   "+ receiverId + " " +text)
      if(user)
      {
        io.to(user.socketId).emit("getMe", {
          senderId,
          text,
        });
      }
    });

    socket.on("FollowNow", ({ senderId, receiverId }) => {
      const user = getUser(receiverId);
      // console.log(senderId + "   "+ receiverId)
      // console.log(user)
      if(user)
      {
        io.to(user.socketId).emit("getFollowNotify", {
          senderId
          
        });
      }
    
      
    });



    socket.on("postMsg", ({ name,message,post_id,receiverId }) => {
      const user = getUser(receiverId);
      // console.log(name + "   "+ message + post_id)
      // console.log(user)
      if(user)
      {
        io.to(user.socketId).emit("getPostMsg", {
          name,
          message,
          post_id,
          receiverId
          
        });
      }
    
      
    });
  
    //when disconnect
    socket.on("disconnect", () => {
      console.log("a user disconnected!");
      removeUser(socket.id);
      io.emit("getUsers", users);
    });
  });