import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OnlineName = ({ profilePicture, userID, getConv }) => {
  const [pname, setPname] = useState('');
  const FacebookUserId = localStorage.getItem('FacebookUserId');
  const getmyidname = async () => {
    let res = await axios.get(
      `https://facebook-node-js-production.up.railway.app/myname/${userID}`
    );
    // console.log(res.data)
    setPname(res.data.name);
  };
  const notify = (msg) =>
    toast.info(msg, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
    });

  const conversationroom = async () => {
    const data = {
      senderId: FacebookUserId,
      receiverId: userID,
    };
    let res = await axios.post(
      `https://facebook-node-js-production.up.railway.app/conversationroom`,
      data
    );
    notify(res.data.msg);
    if (getConv) {
      getConv();
    }
  };
  useEffect(() => {
    if (userID) {
      getmyidname();
    }
  }, [userID]);
  return (
    <>
      <li className="rightbarFriend">
        <div className="rightbarallow">
          <ToastContainer />
          <div className="rightbarProfileImgContainer">
            <img
              className="rightbarProfileImg"
              src={profilePicture ? `${profilePicture}` : `../assets/pro.png`}
              alt=""
            />
            <span className="rightbarOnline"></span>
          </div>
          <span className="rightbarUsername">{pname}</span>
        </div>
        <button className="btn btn-primary btn-sm" onClick={conversationroom}>
          Start
        </button>
      </li>
    </>
  );
};

export default OnlineName;
