import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import '../assets/Login.css'

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    
    const [errMsg, setErrMsg] = useState("");
    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/api/auth/login', {
            username: username,
            password: password,
        }).then((response) => {
            if (response.data.message === "Login successful!") {
              navigate('/dashboard')
            } else {
              setErrMsg(response.data.message);
            }
        });
    };

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
              <div className={errMsg ? "alert alert-danger" : "offscreen"} role="alert">
                {errMsg}
              </div>
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
