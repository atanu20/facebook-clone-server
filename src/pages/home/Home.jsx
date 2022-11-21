import React, { useRef, useEffect, useState } from 'react';
import Feed from '../../component/feed/Feed';
import Sidebar from '../../component/sidebar/Sidebar';
import Rightbar from '../../component/rightbar/Rightbar';
import Topbar from '../../component/topbar/Topbar';
import './Home.css';
import { io } from 'socket.io-client';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
const Home = () => {
  const FacebookUserId = localStorage.getItem('FacebookUserId');
  const [onlineUser, setOnlineUser] = useState([]);
  const socket = useRef();

  const his = useHistory();
  const [friend, setFriend] = useState([]);

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

  // const myfriend=async()=>{
  //   const res=await axios.get(`https://facebook-node-js-production.up.railway.app/getallfd/${FacebookUserId}`)
  //   // console.log(res.data)
  //   setFriend(res.data)
  // }
  // useEffect(() => {
  //   myfriend()
  // }, [])
  // ws://localhost:9000

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
  }, []);
  // console.log(onlineUser)
  return (
    <>
      <Topbar />
      <div className="homecontainer">
        <Sidebar />
        <Feed timeline="timeline" FacebookUserId={FacebookUserId} />

        <Rightbar onlineUser={onlineUser} />
      </div>
    </>
  );
};

export default Home;
