import React, { useEffect, useState } from 'react';

import axios from 'axios';
import FindName from './FindName';

const FindDet = ({ u_id }) => {
  const [user, setUser] = useState([]);
  const getUser = async () => {
    let res = await axios.get(
      `https://facebook-node.onrender.com/myprofile/${u_id}`
    );

    //  console.log(res.data)

    setUser(res.data);
  };
  useEffect(() => {
    getUser();
  }, [u_id]);
  return (
    <>
      {<FindName profilePicture={user.profilePicture} userID={user.userID} />}
    </>
  );
};

export default FindDet;
