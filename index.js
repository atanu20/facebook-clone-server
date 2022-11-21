const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const random = require('random');
const saltRounds = 10;
var router = express.Router();
const PORT = process.env.PORT || 8000;
require('./db/config');
const userDetailsTable = require('./models/userDetails');
const userProfileTable = require('./models/userProfile');
const userPostTable = require('./models/postDetails');
const likeTable = require('./models/PostLikes');
const msgTable = require('./models/userMessage');
const followingTable = require('./models/userFollowing');
const chatingTable = require('./models/usersChat');
const conversationTable = require('./models/userConversation');
const notificationTable = require('./models/userNotification');

const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload());

router.get('/', (req, res) => {
  res.send('update facebook');
});

app.use('/images', express.static(path.join(__dirname, 'public/images')));

router.post('/register', async (req, res) => {
  try {
    const exist = await userDetailsTable.findOne({ email: req.body.email });
    if (exist) {
      res.send({ msg: 'email already exist' });
    } else {
      const password = req.body.password;
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        const usedet = new userDetailsTable({
          name: req.body.name,
          email: req.body.email,
          password: hash,
        });
        // console.log(usedet)
        const up = new userProfileTable({ userID: usedet._id });
        await up.save();
        await usedet.save();
        res.status(201).send({ status: true });
      });
    }
  } catch (err) {
    console.log(err);
  }
});

const verifyJwt = (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (!token) {
    res.send({ login: false, msg: 'need token' });
  } else {
    jwt.verify(token, 'FAceBookclone', (err, decoded) => {
      if (err) {
        res.send({ login: false, msg: 'need to token' });
      } else {
        req.userID = decoded.id;
        next();
      }
    });
  }
};

router.get('/isAuth', verifyJwt, (req, res) => {
  res.send({ login: true, msg: 'done' });
});

router.post('/login', async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const exist = await userDetailsTable.findOne({ email: email });

    if (exist) {
      bcrypt.compare(password, exist.password, (errr, response) => {
        if (response) {
          const id = exist._id;
          //    console.log(id)
          const token = jwt.sign({ id }, 'FAceBookclone', {
            expiresIn: 60 * 60 * 24,
          });
          //    res.cookie('jwtcook',token,{
          //        expires:new Date(Date.now()+30000),
          //        httpOnly:true
          //    })
          res
            .status(200)
            .send({
              login: true,
              token: token,
              name: exist.name,
              userID: exist._id,
              userEmail: exist.email,
            });
          // res.send({login:true,username:exist.username})
        } else {
          res.send({ login: false, msg: 'Wrong Password' });
        }
      });
    } else {
      res.send({ login: false, msg: 'invalid email' });
    }
  } catch (err) {
    console.log(err);
  }
});

router.post('/uploadpost', async (req, res) => {
  try {
    const usedet = new userPostTable({
      postdesc: req.body.postdesc,
      postimg: req.body.postimg,
      user: req.body.user,
      userproimg: req.body.userproimg,
      user_id: req.body.user_id,
    });
    const resu = await usedet.save();
    //   res.status(201).send({msg:"Profile done"})
    res.json({ submit: true });
  } catch (err) {
    console.log(err);
  }
});

router.get('/getmyimg/:id', async (req, res) => {
  try {
    const result = await userProfileTable.findOne({ userID: req.params.id });
    res.send(result);
  } catch (err) {
    console.log(err);
  }
});

router.post('/updateprofile', async (req, res) => {
  try {
    const result = await userProfileTable.findOne({ userID: req.body.userId });

    const ress = await userProfileTable.findByIdAndUpdate(
      result._id,
      {
        profilePicture: req.body.profilePicture,
        coverPicture: req.body.coverPicture,
        desc: req.body.desc,
        worked: req.body.worked,
        address: req.body.address,
        relationship: req.body.relationship,
      },
      { new: true }
    );

    const allpost = await userPostTable.find({ user_id: req.body.userId });
    allpost.map(async (val) => {
      await userPostTable.findByIdAndUpdate(
        val._id,
        {
          userproimg: req.body.profilePicture,
        },
        { new: true }
      );
    });

    const almsg = await msgTable.find({ usid: req.body.userId });
    almsg.map(async (val) => {
      await msgTable.findByIdAndUpdate(
        val._id,
        {
          profile_image: req.body.profilePicture,
        },
        { new: true }
      );
    });

    //  console.log(ress)
    res.json({ submit: true });
  } catch (err) {
    console.log(err);
  }
});

router.get('/myprofile/:id', async (req, res) => {
  try {
    const result = await userProfileTable.findOne({ userID: req.params.id });
    res.send(result);
  } catch (err) {
    console.log(err);
  }
});
router.get('/mypost/:id', async (req, res) => {
  try {
    const result = await userPostTable.find({ user_id: req.params.id });
    res.send(result);
  } catch (err) {
    console.log(err);
  }
});
// router.get('/myprofiledemo/:id',async(req,res)=>{
//     try{
//         const result=await userPostTable.find({user_id:req.params.id})
//         // result.map((val)=>{
//         //     console.log(val.postimg)
//         // })
//         const proimg = await Promise.all(
//             result.map((val) => {
//               return userProfileTable.find({ userID: val.user_id });
//             })
//           );
//         // res.send(result)
//         res.status(200).json(result.concat(...proimg));
//     }
//     catch(err){
//         console.log(err)
//     }
// })

router.get('/postdet/:id', async (req, res) => {
  try {
    const result = await userPostTable.findById(req.params.id);
    res.send(result);
  } catch (err) {
    console.log(err);
  }
});

router.get('/myname/:id', async (req, res) => {
  try {
    const result = await userDetailsTable.findById(req.params.id);
    res.send(result);
  } catch (err) {
    console.log(err);
  }
});

router.get('/postmsg/:id', async (req, res) => {
  try {
    const result = await userDetailsTable.findById(req.params.id);
    res.send(result);
  } catch (err) {
    console.log(err);
  }
});

router.post('/postmsg', async (req, res) => {
  try {
    const post = await userPostTable.findOne({ _id: req.body.post_id });
    const updatedPost = await userPostTable.findByIdAndUpdate(
      { _id: req.body.post_id },
      { totalmsg: post.totalmsg + 1 },
      { new: true }
    );

    const usedet = new msgTable({
      uname: req.body.name,
      profile_image: req.body.profile_image,
      post_id: req.body.post_id,
      message: req.body.message,
      usid: req.body.usid,
    });
    const resu = await usedet.save();
    res.json({ submit: true });
  } catch (err) {
    console.log(err);
  }
});

router.get('/postmsgdata/:pid', async (req, res) => {
  try {
    const result = await msgTable.find({ post_id: req.params.pid });
    res.send(result);
  } catch (err) {
    console.log(err);
  }
});

//  userDetailsTable.aggregate([

//     {
//         $loopup:{
//             from:"userproflies",
//             localField:"_id",
//             foreignField:"userID",
//             as : "user_all_det"
//         }
//     }
// ]).exec(function(err,result){
//     if(err)
//     {
//         console.log(err)
//     }else{
//         console.log(result)
//         res.send(result)
//     }
// })
router.get('/user', async (req, res) => {
  try {
    const result = await userProfileTable.find().limit(50);
    res.send(result);
  } catch (err) {
    console.log(err);
  }
});

router.post('/follow', async (req, res) => {
  try {
    const usedet = new followingTable({
      u_id: req.body.u_id,
      following_id: req.body.following_id,
    });
    const resu = await usedet.save();
    res.json({ submit: true });
  } catch (err) {
    console.log(err);
  }
});
router.post('/unfollow', async (req, res) => {
  try {
    const result = await followingTable.find({
      u_id: req.body.u_id,
      following_id: req.body.following_id,
    });
    const data = await followingTable.findByIdAndDelete(result[0]._id);

    res.json({ submit: true });
  } catch (err) {
    console.log(err);
  }
});

router.post('/checkfollow', async (req, res) => {
  try {
    const result = await followingTable.find({
      u_id: req.body.u_id,
      following_id: req.body.following_id,
    });
    if (result.length) {
      res.json({ submit: true });
    } else {
      res.json({ submit: false });
    }
  } catch (err) {
    console.log(err);
  }
});

router.get('/getallfd/:uid', async (req, res) => {
  try {
    const userPosts = [];
    const result = await followingTable.find({ u_id: req.params.uid });

    const friendPosts = await Promise.all(
      result.map((val) => {
        return userProfileTable.find({ userID: val.following_id });
      })
    );
    res.json(userPosts.concat(...friendPosts));
  } catch (err) {
    console.log(err);
  }
});

router.get('/getFollowers/:uid', async (req, res) => {
  try {
    // const userPosts=[]
    const fdresult = await followingTable.find({
      following_id: req.params.uid,
    });
    //  const result=await followingTable.find({u_id:req.params.uid})

    res.json(fdresult);
  } catch (err) {
    console.log(err);
  }
});
router.get('/getFollowing/:uid', async (req, res) => {
  try {
    const result = await followingTable.find({ u_id: req.params.uid });

    res.json(result);
  } catch (err) {
    console.log(err);
  }
});

router.post('/like', async (req, res) => {
  try {
    const post = await userPostTable.findOne({ _id: req.body.postid });
    const updatedPost = await userPostTable.findByIdAndUpdate(
      { _id: req.body.postid },
      { likes: post.likes + 1 },
      { new: true }
    );
    const usedet = new likeTable({
      uid: req.body.uid,
      postid: req.body.postid,
    });
    const resu = await usedet.save();
    res.json({ submit: true });
  } catch (err) {
    console.log(err);
  }
});

router.post('/checklike', async (req, res) => {
  try {
    const result = await likeTable.find({
      uid: req.body.uid,
      postid: req.body.postid,
    });
    if (result.length) {
      res.json({ submit: true });
    } else {
      res.json({ submit: false });
    }
  } catch (err) {
    console.log(err);
  }
});

router.get('/timeline/:id', async (req, res) => {
  try {
    const currentUser = req.params.id;

    const userPosts = await userPostTable.find({ user_id: currentUser });
    const getfd = await followingTable.find({ u_id: currentUser });
    const friendPosts = await Promise.all(
      getfd.map((val) => {
        return userPostTable.find({ user_id: val.following_id });
      })
    );
    res.json(userPosts.concat(...friendPosts));
  } catch (err) {
    console.log(err);
  }
});

//massenger routes conversationTable chatingTable

router.post('/conversationroom', async (req, res) => {
  const newConversation = new conversationTable({
    members: [req.body.senderId, req.body.receiverId],
  });

  try {
    // members: { $in: [req.body.senderId,req.body.receiverId] },
    // console.log(req.body.senderId + " " + req.body.receiverId)
    const conversation = await conversationTable.find({
      $and: [
        { members: { $in: [req.body.senderId] } },
        { members: { $in: [req.body.receiverId] } },
      ],
    });
    //   console.log(conversation)
    if (conversation.length) {
      res.status(200).json({ status: true, msg: 'ChatRoom Already  Have' });
    } else {
      const savedConversation = await newConversation.save();
      // console.log(savedConversation._id)
      const newMessage = new chatingTable({
        conversationId: savedConversation._id,
        senderId: req.body.senderId,
        text: 'Hello!!',
      });
      await newMessage.save();
      res.status(200).json({ status: true, msg: 'ChatRoom Created' });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/conversation/:userId', async (req, res) => {
  try {
    const conversation = await conversationTable.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

//   router.get("/conversationmember/:Id", async (req, res) => {
//     try {
//       const conversation = await conversationTable.find({
//         members: { $in: [req.params.userId] },
//       });
//       res.status(200).json(conversation);
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   });

router.get('/conversationid/:convId', async (req, res) => {
  try {
    const conversation = await conversationTable.findById(req.params.convId);
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/sendconv', async (req, res) => {
  const newMessage = new chatingTable(req.body);

  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/conversationmsg/:conversationId', async (req, res) => {
  try {
    const messages = await chatingTable.find({
      conversationId: req.params.conversationId,
    });

    if (messages.length) {
      res.status(200).json(messages);
    } else {
      res.json({ msg: 'Sorry There is No Conversation between Us' });
    }
  } catch (err) {
    console.log(err);
  }
});

router.post('/sendNotify', async (req, res) => {
  const newnotificationTable = new notificationTable(req.body);

  try {
    const savednoti = await newnotificationTable.save();
    res.status(200).json(savednoti);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/getNotify/:uid', async (req, res) => {
  try {
    const result = await notificationTable.find({
      user_id: req.params.uid,
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.use(router);

app.listen(PORT, () => {
  console.log(`App running on ${PORT}`);
});
