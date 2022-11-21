import './profile.css';
import Sidebar from '../../component/sidebar/Sidebar';
import Feed from '../../component/feed/Feed';
import Rightbar from '../../component/rightbar/Rightbar';

import Topbar from '../../component/topbar/Topbar';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { useHistory, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
// import CircularProgress from '@material-ui/core/CircularProgress';
// import { CodeSharp } from "@material-ui/icons";
import { io } from 'socket.io-client';
export default function Profile() {
  const { id } = useParams();
  const socket = useRef();
  const his = useHistory();
  const [desc, setDesc] = useState('');
  const [worked, setWorked] = useState('');
  const [address, setAddress] = useState('');
  const [relationship, setRelationship] = useState('Singel');
  // const [interest, setInterest] = useState("")
  const [coverimg, setCoverimg] = useState([]);
  const [profileimg, setProfileimg] = useState([]);
  const [follownow, setFollowNow] = useState(true);
  const [butt, setButton] = useState(false);
  const [mypro, setMypro] = useState([]);
  const [pname, setPname] = useState('');

  const FacebookUserId = localStorage.getItem('FacebookUserId');
  const FacebookUser = localStorage.getItem('FacebookUser');

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

  const notify = (msg) =>
    toast.error(msg, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
    });

  const getmydata = async () => {
    let res = await axios.get(
      `https://facebook-node-js-production.up.railway.app/myprofile/${id}`
    );

    //  console.log(res.data.reverse())
    setMypro(res.data);
  };

  const onUpdate = async (e) => {
    setButton(true);
    e.preventDefault();
    if (coverimg.size > 4000000) {
      notify('File should be less then 4 MB');
      setButton(false);
    } else {
      if (profileimg.size > 4000000) {
        notify('File should be less then 4 MB');
        setButton(false);
      } else {
        if (
          coverimg.type === 'image/jpeg' ||
          coverimg.type === 'image/jpg' ||
          coverimg.type === 'image/png'
        ) {
          if (
            profileimg.type === 'image/jpeg' ||
            profileimg.type === 'image/jpg' ||
            profileimg.type === 'image/png'
          ) {
            let formData = new FormData();
            formData.append('file', coverimg);
            formData.append('upload_preset', 'facebook');
            const resone = await axios.post(
              'https://api.cloudinary.com/v1_1/du9emrtpi/image/upload',
              formData
            );
            console.log(resone.data);
            let fData = new FormData();
            fData.append('file', profileimg);
            fData.append('upload_preset', 'facebook');
            const restwo = await axios.post(
              'https://api.cloudinary.com/v1_1/du9emrtpi/image/upload',
              fData
            );
            console.log(restwo.data);

            const data = {
              coverPicture: resone.data.secure_url,
              profilePicture: restwo.data.secure_url,
              desc: desc,
              worked: worked,
              address: address,
              relationship: relationship,
              userId: FacebookUserId,
            };

            let res = await axios.post(
              'https://facebook-node-js-production.up.railway.app/updateprofile',
              data
            );
            if (res.data.submit) {
              window.location.reload();
              setButton(false);
              // getmydata()
            }
          } else {
            notify('Only jpg ,jpeg and PNG');
            setButton(false);
          }
        } else {
          notify('Only jpg ,jpeg and PNG');
          setButton(false);
        }
      }
    }

    // let formData=new FormData();
    //     formData.append("coverPicture",coverimg)
    //     formData.append("profilePicture",profileimg)
    //     formData.append("desc",desc)
    //     formData.append("worked",worked)
    //     formData.append("address",address)
    //     formData.append("relationship",relationship)

    //     formData.append("userId",FacebookUserId)
    //     let res=await axios.post("https://facebook-node-js-production.up.railway.app/updateprofile",formData);
    //     if(res.data.submit)
    //     {
    //       window.location.reload()
    //       // getmydata()
    //     }
    //     else{
    //       notify(res.data.msg)
    //     }
  };

  const getmyidname = async () => {
    let res = await axios.get(
      `https://facebook-node-js-production.up.railway.app/myname/${id}`
    );
    // console.log(res.data)
    setPname(res.data.name);
  };

  const checkfollow = async () => {
    const data = {
      u_id: FacebookUserId,
      following_id: id,
    };
    let res = await axios.post(
      `https://facebook-node-js-production.up.railway.app/checkfollow`,
      data
    );
    // console.log(res.data)

    setFollowNow(res.data.submit);
  };

  useEffect(() => {
    socket.current = io(
      'https://facebook-socket-server-production.up.railway.app/'
    );
  }, []);
  const Follownow = async () => {
    const data = {
      u_id: FacebookUserId,
      following_id: id,
    };
    socket.current.emit('addUser', FacebookUserId);
    socket.current?.emit('FollowNow', {
      senderId: FacebookUserId,
      receiverId: id,
    });
    const res = await axios.post(
      `https://facebook-node-js-production.up.railway.app/follow`,
      data
    );
    checkfollow();
  };

  const unFollownow = async () => {
    const data = {
      u_id: FacebookUserId,
      following_id: id,
    };
    const res = await axios.post(
      `https://facebook-node-js-production.up.railway.app/unfollow`,
      data
    );
    console.log(res.data);
    checkfollow();
  };

  useEffect(() => {
    getmyidname();
    getmydata();
    checkfollow();
  }, [id]);

  // if(!mypro.length)
  // {
  //   return (
  //     <>
  //    <Topbar/>
  //    <div className="container">

  //    <div className="text-center">
  //      <CircularProgress/>
  //    </div>

  //    </div>

  //     </>
  //   )
  // }

  return (
    <>
      <Topbar />
      <ToastContainer />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                className="profileCoverImg"
                src={
                  mypro.coverPicture
                    ? `${mypro.coverPicture}`
                    : `../assets/nocover.jpg`
                }
                alt=""
              />
              <img
                className="profileUserImg"
                src={
                  mypro.profilePicture
                    ? `${mypro.profilePicture}`
                    : `../assets/pro.png`
                }
                alt=""
              />
              {FacebookUserId === id && (
                <div className="editbox">
                  <Tooltip
                    title="Edit Proflie and cover image"
                    data-toggle="modal"
                    data-target="#myModal"
                  >
                    <IconButton aria-label="delete">
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </div>
              )}
            </div>
            <div className="text-right">
              {!(FacebookUserId === id) ? (
                <>
                  {follownow ? (
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={unFollownow}
                    >
                      UnFollow <i className=" pl-2 fa fa-minus"></i>{' '}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-info"
                      onClick={Follownow}
                    >
                      Follow <i className="pl-2 fa fa-plus"></i>
                    </button>
                  )}
                </>
              ) : null}
              {/* <button type="button"  className="btn btn-info">Follow  <i className=" pl-2 fa fa-minus"></i> </button> */}

              <div class="modal fade text-left" id="myModal">
                <div class="modal-dialog modal-dialog-centered">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h4 class="modal-title">Edit Your Details</h4>
                      <button type="button" class="close" data-dismiss="modal">
                        &times;
                      </button>
                    </div>

                    <form onSubmit={onUpdate}>
                      <div class="modal-body">
                        <div class="form-group">
                          <label>Cover Image :</label>
                          <input
                            type="file"
                            class="form-control"
                            accept=".png,.jpeg,.jpg"
                            onChange={(e) => setCoverimg(e.target.files[0])}
                            required
                          />
                        </div>
                        <div class="form-group">
                          <label>Profile Image :</label>
                          <input
                            type="file"
                            class="form-control"
                            accept=".png,.jpeg,.jpg"
                            onChange={(e) => setProfileimg(e.target.files[0])}
                            required
                          />
                        </div>

                        <div class="form-group">
                          <label>Description :</label>
                          <input
                            type="text"
                            class="form-control"
                            placeholder="Write your description"
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                            required
                          />
                        </div>
                        <div class="form-group">
                          <label>Worked as :</label>
                          <input
                            type="text"
                            class="form-control"
                            placeholder="Woked as ?"
                            value={worked}
                            onChange={(e) => setWorked(e.target.value)}
                            required
                          />
                        </div>
                        <div class="form-group">
                          <label>Address :</label>
                          <input
                            type="text"
                            class="form-control"
                            placeholder="Write your address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                          />
                        </div>
                        <div class="form-group">
                          <label>Relationship:</label>
                          <select
                            class="form-control"
                            value={relationship}
                            onChange={(e) => setRelationship(e.target.value)}
                            required
                          >
                            <option value="Singel">Singel</option>
                            <option value="In a relationship">
                              In a relationship
                            </option>
                            <option value="Married">Married</option>
                            <option value="Its complicated">
                              It's complicated
                            </option>
                          </select>
                        </div>

                        {/*         
        <div class="form-group">
        <label >You are interested in ?</label>
          <input type="text" class="form-control" placeholder="Like Cricket,music,Gaming" value={interest} onChange={(e)=>setInterest(e.target.value)} required  />
        </div> */}
                      </div>

                      <div class="modal-footer">
                        <button
                          type="submit"
                          disabled={butt}
                          className="btn btn-info"
                        >
                          {butt ? <>Updating . . .</> : <>Update Now</>}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">{pname} </h4>
              <span className="profileInfoDesc">{mypro.desc}</span>
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed
              profile="profile"
              FacebookUserId={FacebookUserId}
              pid={id}
              pname={pname}
            />
            <Rightbar
              profile
              pid={id}
              address={mypro.address}
              worked={mypro.worked}
              relationship={mypro.relationship}
            />
          </div>
        </div>
      </div>
    </>
  );
}
