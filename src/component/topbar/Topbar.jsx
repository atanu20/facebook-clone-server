import React, { useEffect, useState, useRef } from 'react';
import './Topbar.css';
import { Search, Person, Chat, Notifications } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import { Howl } from 'howler';
import msg from '../../sound/msg.mp3';
import OneNew from '../../sound/OneNew.mp3';
import output from '../../sound/output.wav';
import foll from '../../sound/foll.wav';
const Topbar = ({ setArrivalMessage }) => {
  const socket = useRef();
  const FacebookUserId = localStorage.getItem('FacebookUserId');
  const [myimg, setMyimg] = useState('');

  const history = useHistory();
  const getmyimg = async () => {
    const res = await axios.get(
      `https://facebook-node-js-production.up.railway.app/getmyimg/${FacebookUserId}`
    );
    setMyimg(res.data.profilePicture);
  };
  useEffect(() => {
    getmyimg();
  }, []);
  const play = () => {
    var sound = new Howl({
      src: [foll],
      autoplay: true,

      onend: function () {
        //   console.log('Finished!');
      },
    });

    sound.play();
  };

  const playmeu = () => {
    var sound = new Howl({
      src: [OneNew],
      autoplay: true,

      onend: function () {
        //   console.log('Finished!');
      },
    });

    sound.play();
  };

  const playnot = () => {
    var sound = new Howl({
      src: [output],
      autoplay: true,

      onend: function () {
        //   console.log('Finished!');
      },
    });

    sound.play();
  };

  useEffect(() => {
    socket.current = io(
      'https://facebook-socket-server-production.up.railway.app/'
    );
    socket.current?.emit('addUser', FacebookUserId);
    socket.current.on('getFollowNotify', (data) => {
      play();
    });

    socket.current.on('getPostMsg', async (data) => {
      if (data) {
        playnot();

        console.log(data);
      }
    });

    socket.current?.on('getMe', (data) => {
      if (data) {
        //    console.log(data)
        playmeu();
        if (setArrivalMessage) {
          setArrivalMessage({
            senderId: data.senderId,
            text: data.text,
            date: Date.now(),
          });
        }
        //    setConversationMsg(vall)
      }
    });
  }, []);

  const Logout = () => {
    localStorage.removeItem('FacebookUserId');
    localStorage.removeItem('FacebookEmail');

    localStorage.removeItem('FacebookUser');
    localStorage.removeItem('Facebooktoken');

    window.location.reload();
  };
  //    console.log(mynot)
  return (
    <>
      <div className="topbarcontainer">
        <div className="tobarleft">
          <span className="logo" onClick={() => history.push('/')}>
            SocialAPP
          </span>
        </div>
        <div className="topbarcenter">
          <div className="searchbar">
            <Search className="searchicon" />
            <input
              type="text"
              placeholder="Search for friend,post or video"
              className="searchinput"
            />
          </div>
        </div>
        <div className="topbarright">
          <div className="topbarlinks">
            <span className="topbarlink" onClick={() => history.push('/')}>
              Home
            </span>
            {FacebookUserId ? (
              <>
                <span className="topbarlink" onClick={Logout}>
                  LogOut
                </span>
              </>
            ) : (
              <span
                className="topbarlink"
                onClick={() => history.push('/login')}
              >
                Login
              </span>
            )}
          </div>
          <div className="topbaricons">
            <div
              className="topbariconitem"
              onClick={() => history.push('/followers')}
            >
              <Person />
              {/* <span className="topbariconbadge">{mynot}</span> */}
            </div>
            <div
              className="topbariconitem"
              onClick={() => history.push('/messanger')}
            >
              <Chat />
              {/* <span className="topbariconbadge">1</span> */}
            </div>
            <div
              className="topbariconitem"
              onClick={() => history.push('/notification')}
            >
              <Notifications />
              {/* <span className="topbariconbadge">1</span> */}
            </div>
          </div>
          <img
            src={myimg ? `${myimg}` : `../assets/pro.png`}
            alt=""
            className="topbarimg"
            onClick={() => history.push(`/profile/${FacebookUserId}`)}
          />
        </div>
      </div>
    </>
  );
};

export default Topbar;
