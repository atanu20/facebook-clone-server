import React, { useState, useEffect } from 'react';
import { PermMedia, Label, Room, EmojiEmotions } from '@material-ui/icons';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Share.css';
import axios from 'axios';
const Share = () => {
  const FacebookUserId = localStorage.getItem('FacebookUserId');
  const FacebookUser = localStorage.getItem('FacebookUser');
  const [myimg, setMyimg] = useState('');
  const [posttext, setPosttext] = useState('');
  const [postimg, setPostimg] = useState([]);
  const [postprev, setPostprev] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const getmyimg = async () => {
    const res = await axios.get(
      `https://facebook-node-js-production.up.railway.app/getmyimg/${FacebookUserId}`
    );
    setMyimg(res.data.profilePicture);
  };
  useEffect(() => {
    getmyimg();
  }, []);
  const handelImg = (e) => {
    const { files } = e.target;
    if (files.length > 0) {
      setPostimg(files[0]);
      setPostprev(true);
    }
  };
  const postSub = async (e) => {
    e.preventDefault();
    setPostprev(false);
    setLoading(true);

    if (postimg.size > 4000000) {
      notify('File should be less then 4 MB');
      setPosttext('');
      setPostimg([]);
      setLoading(false);
    } else {
      if (
        postimg.type === 'image/jpeg' ||
        postimg.type === 'image/jpg' ||
        postimg.type === 'image/png'
      ) {
        let formData = new FormData();
        formData.append('file', postimg);
        formData.append('upload_preset', 'facebook');
        const ress = await axios.post(
          'https://api.cloudinary.com/v1_1/du9emrtpi/image/upload',
          formData
        );

        const data = {
          postimg: ress.data.secure_url,
          postdesc: posttext,
          user: FacebookUser,
          userproimg: myimg,
          user_id: FacebookUserId,
        };

        let res = await axios.post(
          'https://facebook-node-js-production.up.railway.app/uploadpost',
          data
        );
        if (res.data.submit) {
          setPosttext('');
          setPostimg([]);
          setLoading(false);
          window.location.reload();
        } else {
          notify(res.data.msg);
          setPosttext('');
          setPostimg([]);
          setLoading(false);
        }
      } else {
        notify('Only jpg ,jpeg and PNG');
        setPosttext('');
        setPostimg([]);
        setLoading(false);
      }
    }

    // let formData=new FormData();
    // formData.append("postimg",postimg)
    // formData.append("postdesc",posttext)
    // formData.append("user",FacebookUser)
    // formData.append("userproimg",myimg)
    // formData.append("user_id",FacebookUserId)
    // let res=await axios.post("https://facebook-node-js-production.up.railway.app/uploadpost",formData);
    // console.log(res.data)
    // if(res.data.submit)
    // {

    //     setPosttext("")
    //    setPostimg([])
    //    setLoading(false)
    //    window.location.reload()
    // }else{
    //     notify(res.data.msg)
    //     setPosttext("")
    //     setPostimg([])
    //     setLoading(false)
    // }
  };

  return (
    <>
      <ToastContainer />
      <div className="share">
        <form onSubmit={postSub}>
          <div className="sharewrapper">
            <div className="sharetop">
              <img
                src={myimg ? `${myimg}` : `../assets/pro.png`}
                alt="share"
                className="shareprofileimg"
              />
              <input
                maxLength="100"
                placeholder={`Whats in your mind ${FacebookUser}? (max 100 letters)`}
                className="shareinput"
                name="post"
                value={posttext}
                onChange={(e) => setPosttext(e.target.value)}
                autoComplete="off"
              />
            </div>
            <hr className="shareHr" />
            {postprev ? (
              <div className="imgbox">
                <img
                  src={URL.createObjectURL(postimg)}
                  alt=""
                  className="postim"
                />
              </div>
            ) : (
              <br />
            )}
            {loading && (
              <div className="lodbox">
                {' '}
                <CircularProgress size="30px" /> <br />
              </div>
            )}

            <div className="sharebuttom mt-1">
              <div className="shareoptions">
                <label htmlFor="file" className="shareoption">
                  <PermMedia htmlColor="tomato" className="shareicon" />
                  <span className="shareoptiontext">Photo</span>
                  <input
                    style={{ display: 'none' }}
                    type="file"
                    id="file"
                    accept=".png,.jpeg,.jpg"
                    onChange={handelImg}
                  />
                </label>
                <div className="shareoption">
                  <Label htmlColor="blue" className="shareicon" />
                  <span className="shareoptiontext">Tag</span>
                </div>
                <div className="shareoption">
                  <Room htmlColor="green" className="shareicon" />
                  <span className="shareoptiontext">Location</span>
                </div>
                <div className="shareoption">
                  <EmojiEmotions htmlColor="goldenrod" className="shareicon" />
                  <span className="shareoptiontext">Feelings</span>
                </div>
              </div>
              <button type="submit" className="sharebutton">
                Share
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Share;
