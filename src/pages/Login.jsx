import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import axios from 'axios';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const his = useHistory();

  const [status, setStatus] = useState(false);
  const [msg, setMsg] = useState('');

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
        if (response.data.login) {
          his.push('/');
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

  const onSub = async (e) => {
    e.preventDefault();
    // console.log(name)
    const data = {
      email,
      password,
    };

    const res = await axios.post(
      'https://facebook-node-js-production.up.railway.app/login',
      data
    );
    console.log(res.data);
    if (res.data.msg) {
      setStatus(true);
      setMsg(res.data.msg);
    } else {
      localStorage.setItem('Facebooktoken', res.data.token);

      localStorage.setItem('FacebookUser', res.data.name);
      localStorage.setItem('FacebookEmail', res.data.userEmail);
      localStorage.setItem('FacebookUserId', res.data.userID);
      his.push('/');
    }
  };

  return (
    <>
      <div className="login">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 col-md-11 col-12 mx-auto">
              <div className="card">
                {status ? (
                  <>
                    <div className="alert alert-primary alert-dismissible fade show ">
                      <button
                        type="button"
                        className="close"
                        data-dismiss="alert"
                        onClick={() => setStatus(false)}
                      >
                        &times;
                      </button>
                      <p>{msg}</p>
                    </div>
                  </>
                ) : null}
                <div className="row">
                  <div className="col-md-6 col-12 mx-auto mb-3 order-lg-1 order-md-1 order-2">
                    <h3 className="text-center">Login Now</h3>
                    <br />
                    <form onSubmit={onSub}>
                      <div className="form-group">
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="*Enter Email"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="password"
                          className="form-control"
                          name="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="*Enter Password"
                          required
                        />
                      </div>
                      <br />
                      <div className="text-center">
                        <button type="submit" className="btn btn-info">
                          Login Now
                        </button>
                      </div>
                      <br />
                      <NavLink to="/register">Create an Account</NavLink>
                    </form>
                  </div>

                  <div className="col-md-6 col-12 mx-auto mb-3 d-flex justify-content-center align-items-center order-lg-2 order-md-2 order-1">
                    <img
                      src="assets/login.svg"
                      alt="register"
                      className="logimg "
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
