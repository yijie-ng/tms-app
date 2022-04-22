import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import '../assets/Login.css';
import useAuth from '../hooks/useAuth';

function Login() {
    const { auth, setAuth } = useAuth();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    
    const [errMsg, setErrMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/dashboard";

    axios.defaults.withCredentials = true;

    // const handleSubmit = async (e) => {
    //   e.preventDefault();

    //   try {
    //     const response = await axios.post('http://localhost:3001/api/auth/login', {
    //       username: username,
    //       password: password
    //     });
    //     console.log(response?.data);
    //     const accessToken = response?.data?.accessToken;
    //     setAuth({ username, password, accessToken });
    //     if (accessToken.length > 0) {
    //       navigate('/dashboard');
    //     };
    //   } catch (err) {
    //     if (!err?.response) {
    //       setErrMsg(err.response);
    //       console.log(err);
    //     } 
    //   }
    // };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/api/auth/login', {
            username: username,
            password: password,
        }).then((response) => {
            if (response.data.message === "Login successful!") {
              const accessToken = response?.data?.accessToken;
              const userRole = response?.data?.role;
              const id = response?.data?.id;
              setAuth({ id, username, password, userRole, accessToken });
              // localStorage.setItem('user', auth);
              setSuccessMsg(response.data.message);
              navigate(from, { replace: true });
            } else {
              setErrMsg(response.data.message);
            }
            console.log(response?.data);
        });
    };

    // useEffect(() => {
      
    // })

    // useEffect(() => {
    //   axios.get('http://localhost:3001/login').then((response) => {
    //     console.log(response);
    //   })
    // });

  return (
    <div className='container'>
      <div className='row justify-content-center'>
        <div className='col-xs-12 col-sm-4 col-sm-offset-4'>
          <div className='form-login'>
            <h2 className='text-center mt-4'>Sign In</h2>
            <form onSubmit={handleSubmit}>
              {successMsg ? 
                <div className={successMsg ? "alert alert-success" : "offscreen"} role="alert">
                  {successMsg}
                </div> :               
                <div className={errMsg ? "alert alert-danger" : "offscreen"} role="alert">
                  {errMsg}
                </div>}
              <div className="form-group mt-3">
                <label htmlFor="username">Username:</label>
                <input 
                  className="form-control"
                  type="text"
                  id="username"
                  required
                  onChange={(e) => {
                      setUsername(e.target.value);
                      }} />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password:</label>
                  <input 
                    className="form-control"
                    type="password"
                    id="password"
                    required
                    onChange={(e) => {
                        setPassword(e.target.value);
                        }} />
              </div>
              <button type="submit" className="btn btn-primary btn-block">Sign In</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login;
