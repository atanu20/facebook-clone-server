import React, { useEffect, useState, useRef } from 'react';
import Topbar from '../../component/topbar/Topbar';
import './Notification.css';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useHistory } from 'react-router-dom';
const Notification = () => {
  const FacebookUserId = localStorage.getItem('FacebookUserId');
  const [notification, setNotification] = useState([]);
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
  const getnot = async () => {
    const res = await axios.get(
      `https://facebook-node.onrender.com/getNotify/${FacebookUserId}`
    );
    setNotification(
      res.data.sort((p1, p2) => {
        return new Date(p2.date) - new Date(p1.date);
      })
    );
  };
  useEffect(() => {
    getnot();
  }, []);

  if (!notification.length) {
    return (
      <>
        <Topbar />
        <div className="loadder">
          <CircularProgress />

          <p className="p-3">There is no Notification</p>
        </div>
      </>
    );
  }
  return (
    <>
      <Topbar />
      <div className=" notifi container pt-5">
        <h3>All Notification</h3>
        <br />
        <div className="row">
          {notification?.map((val, ind) => {
            return (
              <>
                <div
                  className="col-md-10 col-12 mx-auto mb-3"
                  key={ind}
                  onClick={() => his.push(`/postdetails/${val.post_id}`)}
                >
                  <div className="card p-3">
                    <p>
                      {' '}
                      <strong>{val.name}</strong> messaged{' '}
                      <strong>{val.message}</strong> , Click here to see this
                      post
                    </p>
                  </div>
                </div>
              </>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Notification;
