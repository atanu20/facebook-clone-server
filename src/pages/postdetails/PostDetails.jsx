import React, { useState, useEffect, useRef } from 'react';
import './PostDetails.css';
import Topbar from '../../component/topbar/Topbar';
import { useHistory, useParams } from 'react-router-dom';
import Sidebar from '../../component/sidebar/Sidebar';
import { format } from 'timeago.js';
import axios from 'axios';
import { io } from 'socket.io-client';
const PostDetails = () => {
  const { postid } = useParams();
  const socket = useRef();
  const FacebookUserId = localStorage.getItem('FacebookUserId');
  const FacebookUser = localStorage.getItem('FacebookUser');
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState('');
  const [allmsg, setALLMsg] = useState([]);
  const [postdet, setPostDet] = useState([]);
  const [likeshow, setLikeShow] = useState(false);
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

  const getiddata = async () => {
    let res = await axios.get(
      `https://facebook-node.onrender.com/postdet/${postid}`
    );
    setPostDet(res.data);
  };

  const checklike = async () => {
    const data = {
      postid: postid,
      uid: FacebookUserId,
    };
    const res = await axios.post(
      'https://facebook-node.onrender.com/checklike',
      data
    );
    if (res.data.submit) {
      setLikeShow(true);
    } else {
      setLikeShow(false);
    }
  };

  const likeHandler = async () => {
    const data = {
      postid: postid,
      uid: FacebookUserId,
    };
    const res = await axios.post(
      'https://facebook-node.onrender.com/like',
      data
    );
    //  console.log(res.data)
    getiddata();
    checklike();
  };

  const getmsg = async () => {
    const res = await axios.get(
      `https://facebook-node.onrender.com/postmsgdata/${postid}`
    );
    if (res.data.length) {
      setALLMsg(res.data);
    } else {
      setALLMsg([]);
    }
  };

  useEffect(() => {
    socket.current = io('https://facebook-clone-socket.onrender.com/');
  }, []);

  const onSub = async (e) => {
    e.preventDefault();
    const res = await axios.get(
      `https://facebook-node.onrender.com/myprofile/${FacebookUserId}`
    );
    // console.log(res.data)
    const data = {
      name: FacebookUser,
      profile_image: res.data.profilePicture,
      post_id: postid,
      message: msg,
      usid: FacebookUserId,
    };

    socket.current.emit('addUser', FacebookUserId);
    socket.current?.emit('postMsg', {
      name: FacebookUser,
      message: msg,
      post_id: postid,
      receiverId: postdet.user_id,
    });
    const valu = {
      name: FacebookUser,
      message: msg,
      post_id: postid,
      user_id: postdet.user_id,
    };
    await axios.post('https://facebook-node.onrender.com/sendNotify', valu);

    const ress = await axios.post(
      `https://facebook-node.onrender.com/postmsg`,
      data
    );
    if (ress.data.submit) {
      getiddata();
      getmsg();
    }

    setMsg('');
    setShow(true);
  };

  useEffect(() => {
    getiddata();
    getmsg();
    checklike();
  }, [postid]);

  return (
    <>
      <Topbar />
      <div className="userdetails">
        <Sidebar />
        <div className="detpost">
          <div className="postuserdetails ">
            <div className="usericonbox mt-5 pl-4 pr-4">
              <div className="usericonboxpost">
                <img
                  src={
                    postdet.userproimg
                      ? `${postdet.userproimg}`
                      : `../assets/pro.png`
                  }
                  alt=""
                  className="imguser"
                  onClick={() => his.push(`/profile/${postdet.user_id}`)}
                />{' '}
                <span
                  style={{ cursor: 'pointer' }}
                  onClick={() => his.push(`/profile/${postdet.user_id}`)}
                >
                  {postdet.user}
                </span>{' '}
                &nbsp; &nbsp;&nbsp;{' '}
                <span className="dat">{format(postdet.date)}</span>
              </div>
            </div>
          </div>

          <div className="container">
            <h5 className="text-center">{postdet.postdesc}</h5>
            <img
              src={
                postdet.postimg ? `${postdet.postimg}` : `../assets/post/1.jpeg`
              }
              alt=""
              className="detimg"
            />
          </div>
          <div className="likebox">
            <div className="likeitems">
              {likeshow ? (
                <i class="fa fa-heart" aria-hidden="true"></i>
              ) : (
                <img
                  className="likeIcon"
                  src="../assets/heart.png"
                  alt=""
                  onClick={likeHandler}
                />
              )}

              <span className="postLikeCounter">
                &nbsp; {postdet.likes} people like it
              </span>
            </div>
            <div className="messageitems">
              <span className="postCommentText">
                {postdet.totalmsg} comments
              </span>
            </div>
          </div>

          <div className="addmsg">
            <form onSubmit={onSub}>
              <div class="form-group">
                <input
                  type="text"
                  placeholder="Write Your Message"
                  class="form-control"
                  name="msg"
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  autoComplete="off"
                  required
                />
                <button type="submit" className="btn btn-dark m-2">
                  Send
                </button>
              </div>
            </form>
            <br />
            <div className="title-bo">
              <p>All Messages</p>
              <div className="drop" onClick={() => setShow(!show)}>
                {show ? (
                  <i className="fa fa-chevron-up"></i>
                ) : (
                  <i className="fa fa-chevron-down"></i>
                )}
              </div>
            </div>
            {show && (
              <div className="allmsg">
                <div className="msgbox">
                  {!allmsg.length && (
                    <>
                      <div className="msgg">
                        <h3>Sorry there is no message ...</h3>
                      </div>
                    </>
                  )}

                  {allmsg.map((val, ind) => {
                    return (
                      <>
                        <div className="msgg" key={ind + 1}>
                          <img
                            src={
                              val.profile_image
                                ? `${val.profile_image}`
                                : `../assets/pro.png`
                            }
                            alt={val.profile_image}
                            className="vimg"
                          />
                          <h5>{val.uname}</h5>
                        </div>
                        <p>{val.message}</p>
                      </>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PostDetails;
