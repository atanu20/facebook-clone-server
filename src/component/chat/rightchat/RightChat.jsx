import React, { useEffect, useState, useRef } from 'react';
import './RightChat.css';
import Online from '../../online/Online';
import { io } from 'socket.io-client';
import axios from 'axios';
const RightChat = ({ getConv }) => {
  const FacebookUserId = localStorage.getItem('FacebookUserId');
  const [onlineUser, setOnlineUser] = useState([]);
  const socket = useRef();
  useEffect(() => {
    socket.current = io(
      'https://facebook-socket-server-production.up.railway.app/'
    );
  }, []);
  useEffect(() => {
    socket.current?.emit('addUser', FacebookUserId);
    socket.current?.on('getUsers', async (users) => {
      const res = await axios.get(
        `https://facebook-node-js-production.up.railway.app/getallfd/${FacebookUserId}`
      );
      //  console.log(res.data.filter((val) => users.some((u) => u.userId === val.userID)))
      setOnlineUser(
        res.data.filter((val) => users.some((u) => u.userId === val.userID))
      );
    });
  }, [FacebookUserId]);

  return (
    <>
      <div className="rightchat">
        <h4 className="pt-3 pb-3 text-center">Online Friends</h4>
        <div className="onlinebox">
          {onlineUser?.map((val, ind) => {
            return (
              <>
                <Online key={ind} userID={val.userID} getConv={getConv} />
              </>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default RightChat;
