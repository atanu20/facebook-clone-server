import React, { useEffect, useState, useRef } from 'react';
import './CenterChat.css';
import LeftFriend from '../leftchat/LeftFriend';
import CenterTop from './centertop/CenterTop';
import Message from './Message';
import axios from 'axios';
import { io } from 'socket.io-client';
const CenterChat = ({
  conversationmsg,
  conversationId,
  setNewMessage,
  newMessage,
  setConversationMsg,
}) => {
  const socket = useRef();
  const FacebookUserId = localStorage.getItem('FacebookUserId');
  const [friendId, setFriendId] = useState('');
  const scrollRef = useRef();

  const getConDetails = async () => {
    const res = await axios.get(
      `https://facebook-node.onrender.com/conversationid/${conversationId}`
    );

    const receiverId = res.data.members.find(
      (member) => member !== FacebookUserId
    );
    setFriendId(receiverId);
  };

  useEffect(() => {
    getConDetails();
  }, [conversationId]);

  // useEffect(() => {
  //     socket.current = io("https://facebook-clone-socket.onrender.com/");

  //   }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const message = {
      conversationId: conversationId,
      senderId: FacebookUserId,
      text: newMessage,
    };

    socket.current = io('https://facebook-clone-socket.onrender.com/');
    socket.current.emit('addUser', FacebookUserId);
    socket.current.emit('sendMessage', {
      senderId: FacebookUserId,
      receiverId: friendId,
      text: newMessage,
    });

    try {
      const res = await axios.post(
        'https://facebook-node.onrender.com/sendconv',
        message
      );
      setConversationMsg([...conversationmsg, res.data]);
      // getConversionMsg()
      // console.log(conversationmsg)
      setNewMessage('');
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationmsg]);

  return (
    <>
      <div className="centerChat">
        <div className="centerChatbox">
          <div className="centerChatboxtop">
            {friendId && <CenterTop friendId={friendId} />}
          </div>
          <div className="centerChatboxmsg">
            {conversationmsg.map((m, ind) => {
              return (
                <>
                  <div ref={scrollRef}>
                    <Message
                      key={ind}
                      friendId={friendId}
                      message={m}
                      own={m.senderId === FacebookUserId}
                    />
                  </div>
                </>
              );
            })}
          </div>
          <div className="centerChatboxmsgwrite p-2">
            <input
              type="text"
              className="inputbox"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              autoComplete="off"
              required
            />

            <button className="btn btn-dark" onClick={handleSubmit}>
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CenterChat;
