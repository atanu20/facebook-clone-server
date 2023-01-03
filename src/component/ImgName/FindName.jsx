import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
const FindName = ({ profilePicture, userID }) => {
  const [name, setName] = useState('');
  const his = useHistory();

  const getname = async () => {
    let res = await axios.get(
      `https://facebook-node.onrender.com/myname/${userID}`
    );
    setName(res.data.name);
  };
  useEffect(() => {
    if (userID) {
      getname();
    }
  }, [userID]);
  return (
    <>
      <div className="col-md-2 col-6 mb-3">
        <div className="card">
          {/* <img src="../profile/157665_taj_mahal.jpg" alt="" className="proimgg" /> */}

          <img
            src={profilePicture ? `${profilePicture}` : `../assets/pro.png`}
            alt=""
            className="proimgg"
            onClick={() => his.push(`/profile/${userID}`)}
          />
          <p className="p-1 text-center">{name}</p>
        </div>
      </div>
    </>
  );
};

export default FindName;
