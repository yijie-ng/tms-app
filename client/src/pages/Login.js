import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/Login.css'

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const login = (e) => {
        e.preventDefault(e);
        axios.post('http://localhost:3001/login', {
            username: username,
            password: password,
        }).then((response) => {
            console.log(response);
        });
    };

  return (
    <div className="login-wrapper">
      <h2 className="mb-4">Log In</h2>
      <form>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input 
            className="form-control"
            type="text"
            onChange={(e) => {
                setUsername(e.target.value);
                }} />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
            <input 
              className="form-control"
              type="password"
              onChange={(e) => {
                  setPassword(e.target.value);
                  }} />
        </div>
        <button type="submit" className="btn btn-primary" onClick={login}>Login</button>
      </form>
    </div>
  )
}

export default Login;
