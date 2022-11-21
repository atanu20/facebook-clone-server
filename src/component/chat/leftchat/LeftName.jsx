import React, { useState, useEffect } from 'react';

import axios from 'axios';
import { useHistory } from 'react-router-dom';

const LeftName = ({ profilePicture, userid, convid, setConversationId }) => {
  const history = useHistory();
  const [pname, setPname] = useState('');
  const getmyidname = async () => {
    let res = await axios.get(
      `https://facebook-node-js-production.up.railway.app/myname/${userid}`
    );
    // console.log(res.data)
    setPname(res.data.name);
  };

  const handelclick = () => {
    setConversationId(convid);
    history.push(`/messanger/${convid}`);
  };

  useEffect(() => {
    if (userid) {
      getmyidname();
    }
  }, [userid]);

  return (
    <>
      <div className="conversationitems" onClick={handelclick}>
        <img
          src={profilePicture ? `${profilePicture}` : `../assets/pro.png`}
          alt=""
          className="conversationitemsimg"
        />{' '}
        <p className="ml-3 pt-2">{pname}</p>
      </div>
    </>
  );
};

export default LeftName;
