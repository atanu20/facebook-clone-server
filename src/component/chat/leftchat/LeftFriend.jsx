import React, { useState, useEffect } from 'react';
import LeftName from './LeftName';
import axios from 'axios';
const LeftFriend = ({ conversation, FacebookUserId, setConversationId }) => {
  const [user, setUser] = useState([]);
  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== FacebookUserId);

    const getUser = async () => {
      try {
        let res = await axios.get(
          `https://facebook-node.onrender.com/myprofile/${friendId}`
        );

        //   console.log(res.data)

        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [conversation]);

  return (
    <>
      {
        <LeftName
          profilePicture={user.profilePicture}
          userid={user.userID}
          convid={conversation._id}
          setConversationId={setConversationId}
        />
      }
    </>
  );
};

export default LeftFriend;
