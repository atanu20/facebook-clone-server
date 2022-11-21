import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
const FindUserFd = ({ userID, profilePicture }) => {
  const [name, setName] = useState('');
  const his = useHistory();

  const getname = async () => {
    let res = await axios.get(
      `https://facebook-node-js-production.up.railway.app/myname/${userID}`
    );
    setName(res.data.name);
  };
  useEffect(() => {
    getname();
  }, [userID]);
  return (
    <>
      <div className="rightbarFollowing">
        <div className="rightwrap">
          <img
            src={profilePicture ? `${profilePicture}` : `../assets/pro.png`}
            alt=""
            className="rightbarFollowingImg"
            onClick={() => his.push(`/profile/${userID}`)}
          />
          <p className="p-1 text-center">{name}</p>
        </div>
      </div>
    </>
  );
};

export default FindUserFd;
