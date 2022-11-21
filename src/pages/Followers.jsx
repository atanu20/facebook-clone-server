import React, { useEffect, useState, useRef } from 'react';
import Topbar from '../component/topbar/Topbar';
import Sidebar from '../component/sidebar/Sidebar';
import './postdetails/PostDetails.css';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useHistory } from 'react-router-dom';
// import FindName from '../component/ImgName/FindName'
import FindDet from '../component/ImgName/FindDet';

const Followers = () => {
  const FacebookUserId = localStorage.getItem('FacebookUserId');
  const [friends, setFriends] = useState([]);
  const his = useHistory();
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

  const myfriend = async () => {
    const res = await axios.get(
      `https://facebook-node-js-production.up.railway.app/getFollowers/${FacebookUserId}`
    );
    //   const ress=await axios.get(`https://facebook-node-js-production.up.railway.app/getFollowing/${FacebookUserId}`)
    //   console.log(res.data)
    //   console.log(ress.data)
    //   const dat=res.data.filter((val)=> ress.data.some((vall) =>  vall.following_id !== val.u_id ))

    //   console.log(dat)
    setFriends(
      res.data.sort((p1, p2) => {
        return new Date(p2.date) - new Date(p1.date);
      })
    );
  };
  useEffect(() => {
    myfriend();
  }, []);

  if (!friends.length) {
    return (
      <>
        <Topbar />
        <div className="userdetails">
          <Sidebar />
          <div className="detpost">
            <div className="loadd">
              <CircularProgress />
              <p className="p-3">There is no Followers Request</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Topbar />
      <div className="userdetails">
        <Sidebar />
        <div className="detpost fdd">
          <div className="container">
            <h2>All Friend Requests</h2>
            <div className="row pl-5 pt-3">
              {/* {
                       friends.map((val,ind)=>{
                           return(
                               <>
                                <FindName
                                key={ind}
                                profilePicture={val.profilePicture}
                                userID={val.userID}

                                />
                               </>
                           )
                       })

                   } */}
              {friends.map((val, ind) => {
                return (
                  <>
                    <FindDet key={ind} u_id={val.u_id} />
                  </>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Followers;
