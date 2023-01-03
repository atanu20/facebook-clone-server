import React, { useEffect, useState, useRef } from 'react';
import Topbar from '../component/topbar/Topbar';
import Sidebar from '../component/sidebar/Sidebar';
import './postdetails/PostDetails.css';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useHistory } from 'react-router-dom';
import FindName from '../component/ImgName/FindName';

const Friends = () => {
  const FacebookUserId = localStorage.getItem('FacebookUserId');
  const [friends, setFriends] = useState([]);
  const his = useHistory();

  const timeout = useRef(null);

  const checkAuth = () => {
    axios
      .get('https://facebook-node.onrender.com/isAuth', {
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

  const getfriends = async () => {
    const res = await axios.get(`https://facebook-node.onrender.com/user`);
    // console.log(res.data.filter((val)=>val.userID !== FacebookUserId).sort( ()=>Math.random()-0.5))
    setFriends(
      res.data
        .filter((val) => val.userID !== FacebookUserId)
        .sort(() => Math.random() - 0.5)
    );
  };
  useEffect(() => {
    getfriends();
  }, []);

  // const Follownow=async(fid)=>{
  //     const data={
  //         u_id:FacebookUserId,
  //         following_id:fid
  //     }
  //     const res=await axios.post(`https://facebook-node.onrender.com/follow`,data)
  //     console.log(res.data)

  // }

  if (!friends.length) {
    return (
      <>
        <Topbar />
        <div className="userdetails">
          <Sidebar />
          <div className="detpost">
            <div className="loadd">
              <CircularProgress />
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
            <h2>All Users</h2>
            <div className="row pl-5 pt-3">
              {/* {
                       friends.map((val,ind)=>{
                           return(<>
                            <div className="col-md-2 col-6" key={ind}>
                    <div className="card" >
                      
                        <img src={val.profilePicture ? `../profile/${val.profilePicture}` : `../assets/pro.png`} alt="" className="proimgg" onClick={()=>his.push(`/profile/${val.userID}`)} />
                        
                        
                    </div>
                    </div>
                           </>)
                       })
                   } */}

              {friends.map((val, ind) => {
                return (
                  <>
                    <FindName
                      key={ind}
                      profilePicture={val.profilePicture}
                      userID={val.userID}
                    />
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

export default Friends;
