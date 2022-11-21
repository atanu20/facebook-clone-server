import React, { useEffect, useState, useRef } from 'react';
import './Messanger.css';
import Topbar from '../../component/topbar/Topbar';
import { useHistory, useParams } from 'react-router-dom';
import LeftChat from '../../component/chat/leftchat/LeftChat';
import RightChat from '../../component/chat/rightchat/RightChat';
import CenterChat from '../../component/chat/centerchat/CenterChat';
import axios from 'axios';
import { io } from 'socket.io-client';

const Messanger = () => {
  const { con_id } = useParams();
  const his = useHistory();
  const FacebookUserId = localStorage.getItem('FacebookUserId');
  const [conversation, setConversation] = useState([]);
  const [conversationmsg, setConversationMsg] = useState([]);
  const [conversationId, setConversationId] = useState('');
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const socket = useRef();
  const [conversionMembers, setConversionMembers] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const [statuss, setStatuss] = useState(null);

  const timeout = useRef(null);

  const checkAuth = () => {
    axios
      .get('https://facebook-node-js-production.up.railway.app/isAuth', {
        headers: {
          'x-access-token': localStorage.getItem('Facebooktoken'),
        },
      })
      .then((response) => {
        //  console.log()
        if (!response.data.login) {
          his.push('/login');
        }
      });
  };

  useEffect(() => {
    timeout.current = setTimeout(checkAuth, 10);
    return function () {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
    //   checkAuth()
  }, []);

  const getConv = async () => {
    const res = await axios.get(
      `https://facebook-node-js-production.up.railway.app/conversation/${FacebookUserId}`
    );
    setConversation(res.data);
  };
  const getConversionMsg = async () => {
    const res = await axios.get(
      `https://facebook-node-js-production.up.railway.app/conversationmsg/${conversationId}`
    );
    setConversationMsg(res.data);
  };
  const getConversionMembers = async () => {
    const res = await axios.get(
      `https://facebook-node-js-production.up.railway.app/conversationid/${conversationId}`
    );
    // console.log(res.data)
    setConversionMembers(res.data);
  };

  useEffect(() => {
    getConv();
  }, []);

  useEffect(() => {
    getConversionMsg();
    getConversionMembers();
  }, [conversationId]);

  //    useEffect(() => {
  //        socket.current = io("https://facebook-socket-server-production.up.railway.app/");
  //        socket.current.emit("addUser", FacebookUserId);
  //        socket.current.on("getMessage", (data) => {
  //         console.log(data)
  //         // setConversationMsg()

  //    });

  //      }, []);

  //  useEffect(() => {
  //     // arrivalMessage &&
  //     // conversionMembers?.members.includes(arrivalMessage.senderId) &&
  //     //   setConversationMsg((prev) => [...prev, arrivalMessage]);
  //     console.log(conversionMembers)
  //   }, [ statuss]);

  // useEffect(() => {

  //     arrivalMessage &&
  //     conversationId?.members.includes(arrivalMessage.senderId) &&
  //     setConversationMsg((prev) => [...prev, arrivalMessage]);
  //   }, [arrivalMessage]);

  useEffect(() => {
    arrivalMessage &&
      conversionMembers?.members.includes(arrivalMessage.senderId) &&
      setConversationMsg((prev) => [...prev, arrivalMessage]);
    //   console.log(arrivalMessage)
  }, [arrivalMessage]);

  return (
    <>
      <Topbar setArrivalMessage={setArrivalMessage} />
      <div className="messenger">
        <LeftChat
          conversation={conversation}
          FacebookUserId={FacebookUserId}
          setConversationId={setConversationId}
        />

        {con_id ? (
          <>
            <CenterChat
              conversationmsg={conversationmsg}
              conversationId={conversationId}
              setNewMessage={setNewMessage}
              newMessage={newMessage}
              setConversationMsg={setConversationMsg}
            />
          </>
        ) : (
          <>
            <div className="prevbox">
              <div className="centerprev">
                <h1>Start A conversation</h1>
              </div>
            </div>
          </>
        )}
        <RightChat getConv={getConv} />
      </div>
    </>
  );
};

export default Messanger;
