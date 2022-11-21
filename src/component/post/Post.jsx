import './post.css';
import { MoreVert } from '@material-ui/icons';
import { format } from 'timeago.js';
import { NavLink, useHistory } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

export default function Post({
  user,
  user_id,
  postid,
  date,
  desc,
  postimg,
  totalmsg,
  likes,
  userproimg,
}) {
  const his = useHistory();
  const FacebookUserId = localStorage.getItem('FacebookUserId');
  const [like, setLike] = useState(likes);
  const [show, setShow] = useState(false);

  const checklike = async () => {
    const data = {
      postid: postid,
      uid: FacebookUserId,
    };
    const res = await axios.post(
      'https://facebook-node-js-production.up.railway.app/checklike',
      data
    );
    if (res.data.submit) {
      setShow(true);
    } else {
      setShow(false);
    }
  };

  const likeHandler = async () => {
    const data = {
      postid: postid,
      uid: FacebookUserId,
    };
    const res = await axios.post(
      'https://facebook-node-js-production.up.railway.app/like',
      data
    );
    //  console.log(res.data)
    setLike(like + 1);
    checklike();
  };

  useEffect(() => {
    checklike();
  }, [postid]);

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <img
              className="postProfileImg"
              src={userproimg ? `${userproimg}` : `../assets/pro.png`}
              alt=""
              onClick={() => his.push(`/profile/${user_id}`)}
            />
            <span
              className="postUsername"
              onClick={() => his.push(`/profile/${user_id}`)}
            >
              {user}
            </span>
            <span className="postDate">{format(date)}</span>
          </div>
          <div className="postTopRight">
            <MoreVert />
          </div>
        </div>
        <div className="postCenter">
          <NavLink to={`/postdetails/${postid}`}>
            <span className="postText ">{desc}</span>
          </NavLink>
          <NavLink to={`/postdetails/${postid}`}>
            <img
              className="postImg"
              src={postimg ? `${postimg}` : `../assets/post/1.jpeg`}
              alt=""
            />
          </NavLink>
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            {show ? (
              <>
                <Tooltip title="You Already Liked It">
                  <IconButton aria-label="delete" style={{ cursor: 'auto' }}>
                    <i class="fa fa-heart" aria-hidden="true"></i>
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <>
                <Tooltip title="Like This Post">
                  <IconButton aria-label="delete">
                    <img
                      className="likeIcon"
                      src="../assets/heart.png"
                      alt=""
                      onClick={likeHandler}
                    />
                  </IconButton>
                </Tooltip>
              </>
            )}

            <span
              style={{ cursor: 'pointer' }}
              className="postLikeCounter"
              onClick={() => his.push(`/postdetails/${postid}`)}
            >
              &nbsp;{like} people like it
            </span>
          </div>
          <div className="postBottomRight">
            <span
              className="postCommentText"
              onClick={() => his.push(`/postdetails/${postid}`)}
            >
              {totalmsg} comments
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
