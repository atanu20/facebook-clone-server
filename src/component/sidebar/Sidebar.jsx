import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import {
  RssFeed,
  Chat,
  PlayCircleFilledOutlined,
  Group,
  Bookmark,
  HelpOutline,
  WorkOutline,
  Event,
  School,
} from '@material-ui/icons';
import GroupAddIcon from '@material-ui/icons/GroupAdd';

import CloseFriend from '../closeFriend/CloseFriend';
import { NavLink, useHistory } from 'react-router-dom';
import axios from 'axios';
const Sidebar = () => {
  const FacebookUserId = localStorage.getItem('FacebookUserId');

  const his = useHistory();
  const [friend, setFriend] = useState([]);
  const myfriend = async () => {
    const res = await axios.get(
      `https://facebook-node-js-production.up.railway.app/getallfd/${FacebookUserId}`
    );
    // console.log(res.data)
    setFriend(res.data);
  };
  useEffect(() => {
    myfriend();
  }, []);

  return (
    <>
      <div className="sidebar">
        <div className="sidebarwrapper">
          <ul className="sidebarlist">
            <li className="sidebarListItem">
              <RssFeed className="sidebarIcon" onClick={() => his.push('/')} />
              <span
                className="sidebarListItemText"
                onClick={() => his.push('/')}
              >
                Feed
              </span>
            </li>
            <li className="sidebarListItem">
              <GroupAddIcon
                className="sidebarIcon"
                onClick={() => his.push('/friends')}
              />
              <span
                className="sidebarListItemText"
                onClick={() => his.push('/friends')}
              >
                Friends
              </span>
            </li>

            <li className="sidebarListItem">
              <Chat
                className="sidebarIcon"
                onClick={() => his.push('/messanger')}
              />
              <span
                className="sidebarListItemText"
                onClick={() => his.push('/messanger')}
              >
                Chats
              </span>
            </li>
            <li className="sidebarListItem">
              <PlayCircleFilledOutlined className="sidebarIcon" />
              <span className="sidebarListItemText">Videos</span>
            </li>
            <li className="sidebarListItem">
              <Group className="sidebarIcon" />
              <span className="sidebarListItemText">Groups</span>
            </li>
            <li className="sidebarListItem">
              <Bookmark className="sidebarIcon" />
              <span className="sidebarListItemText">Bookmarks</span>
            </li>
            <li className="sidebarListItem">
              <HelpOutline className="sidebarIcon" />
              <span className="sidebarListItemText">Questions</span>
            </li>
            <li className="sidebarListItem">
              <WorkOutline className="sidebarIcon" />
              <span className="sidebarListItemText">Jobs</span>
            </li>
            <li className="sidebarListItem">
              <Event className="sidebarIcon" />
              <span className="sidebarListItemText">Events</span>
            </li>
            <li className="sidebarListItem">
              <School className="sidebarIcon" />
              <span className="sidebarListItemText">Courses</span>
            </li>
          </ul>
          <button className="sidebarbutton">Show More</button>
          <hr className="sidebarhr" />
          <ul className="sidebarfriendlist">
            {friend.length ? (
              <>
                {friend.map((val) => {
                  return (
                    <>
                      <CloseFriend
                        profilePicture={val.profilePicture}
                        userID={val.userID}
                      />
                    </>
                  );
                })}
              </>
            ) : (
              <h5>No Friends</h5>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
