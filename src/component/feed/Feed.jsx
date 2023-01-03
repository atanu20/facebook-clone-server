import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Post from '../post/Post';
import Share from '../share/Share';
import axios from 'axios';
import './Feed.css';
const Feed = ({ timeline, profile, FacebookUserId, pid, pname }) => {
  const [posts, setPosts] = useState([]);

  const getmydata = async () => {
    let res = await axios.get(
      `https://facebook-node.onrender.com/mypost/${pid}`
    );

    //  console.log(res.data)
    setPosts(
      res.data.sort((p1, p2) => {
        return new Date(p2.date) - new Date(p1.date);
      })
    );
  };

  const gettimeline = async () => {
    let res = await axios.get(
      `https://facebook-node.onrender.com/timeline/${FacebookUserId}`
    );

    setPosts(
      res.data.sort((p1, p2) => {
        return new Date(p2.date) - new Date(p1.date);
      })
    );
  };

  useEffect(() => {
    if (profile) {
      getmydata();
    }
  }, [pid]);

  useEffect(() => {
    if (timeline) {
      gettimeline();
    }
  }, []);

  return (
    <>
      <div className="feed">
        <div className="feedwrapper">
          {profile ? FacebookUserId === pid && <Share /> : <Share />}

          {posts.map((val, ind) => {
            return (
              <Post
                key={ind}
                user={val.user}
                postid={val._id}
                user_id={val.user_id}
                desc={val.postdesc}
                postimg={val.postimg}
                totalmsg={val.totalmsg}
                userproimg={val.userproimg}
                likes={val.likes}
                date={val.date}
              />
            );
          })}
          {profile && (
            <>
              <div className="greatingbox">
                <h4>Welcome {pname}, Thank You for Joining Here</h4>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Feed;
