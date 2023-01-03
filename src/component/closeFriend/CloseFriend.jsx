import { useHistory } from 'react-router-dom';
import './closeFriend.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
export default function CloseFriend({ profilePicture, userID }) {
  const his = useHistory();
  const [name, setName] = useState('');

  const getname = async () => {
    let res = await axios.get(
      `https://facebook-node.onrender.com/myname/${userID}`
    );
    setName(res.data.name);
  };
  useEffect(() => {
    getname();
  }, [userID]);

  return (
    <li className="sidebarFriend">
      <img
        className="sidebarFriendImg"
        src={profilePicture ? `${profilePicture}` : `../assets/pro.png`}
        alt=""
        onClick={() => his.push(`/profile/${userID}`)}
      />
      <span
        style={{ cursor: 'pointer' }}
        className="sidebarFriendName"
        onClick={() => his.push(`/profile/${userID}`)}
      >
        {name}
      </span>
    </li>
  );
}
