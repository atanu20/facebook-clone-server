import './Rightbar.css';

import Online from '../online/Online';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import FindUserFd from '../ImgName/FindUserFd';

export default function Rightbar({
  pid,
  profile,
  address,
  worked,
  relationship,
  onlineUser,
}) {
  const his = useHistory();
  const [friend, setFriend] = useState([]);
  const myfriend = async () => {
    const res = await axios.get(
      `https://facebook-node.onrender.com/getallfd/${pid}`
    );
    // console.log(res.data)
    setFriend(res.data);
  };
  useEffect(() => {
    myfriend();
  }, [pid]);

  // console.log(onlineUser)
  const HomeRightbar = () => {
    return (
      <>
        <div className="birthdayContainer">
          <img className="birthdayImg" src="../assets/gift.png" alt="" />
          <span className="birthdayText">
            <b>Pola Foster</b> and <b>3 other friends</b> have a birhday today.
          </span>
        </div>
        <img className="rightbarAd" src="../assets/19-min.jpg" alt="" />
        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="rightbarFriendList">
          {onlineUser.map((val, ind) => {
            return (
              <>
                <Online key={ind} userID={val.userID} />
              </>
            );
          })}
        </ul>
        <div className="rightbarads">
          <img src="assets/one.jpg" alt="" className="adsimg" />
          <img src="assets/two.jpg" alt="" className="adsimg" />
        </div>
        <div className="rightbarads">
          <img src="assets/three.jpg" alt="" className="adsimg" />
          <img src="assets/ad.png" alt="" className="adsimg" />
        </div>
      </>
    );
  };

  const ProfileRightbar = () => {
    return (
      <>
        <h4 className="rightbarTitle">User information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Worked as:</span>
            <span className="rightbarInfoValue">{worked}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Address:</span>
            <span className="rightbarInfoValue">{address}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship:</span>
            <span className="rightbarInfoValue">{relationship}</span>
          </div>
          {/* <div className="rightbarInfoItem">
          <span class="badge badge-pill badge-info m-1">Info</span>
          <span class="badge badge-pill badge-info m-1">Info</span>
          <span class="badge badge-pill badge-info m-1">Info</span>
          </div> */}
        </div>
        <h4 className="rightbarTitle">User Following</h4>
        <div className="rightbarFollowings">
          {friend.length ? (
            <>
              {friend.map((val, ind) => {
                return (
                  <>
                    <FindUserFd
                      key={ind}
                      profilePicture={val.profilePicture}
                      userID={val.userID}
                    />
                    {/* <div className="rightbarFollowing" key={ind}>
            <img
              src={val.profilePicture ? `../profile/${val.profilePicture}` : `../assets/pro.png`}
              alt=""
              className="rightbarFollowingImg"
              onClick={()=>his.push(`/profile/${val.userID}`)}
            />
            
          </div> */}
                  </>
                );
              })}
            </>
          ) : (
            <p> Sorry You Have no friends</p>
          )}
        </div>
      </>
    );
  };
  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {profile ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
}
