import React, { useState } from 'react';
import '../assets/Login.css';
import axios from 'axios';

function Register() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const submit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/user', {
            firstName: firstName,
            lastName: lastName,
            username: username, 
            email: email,
            password: password,
        }).then((response) => {
            console.log(response);
        }); 
    };

  return (
    <div className='container'>
      <div className='row justify-content-center'>
        <div className='col-xs-12 col-sm-4 col-sm-offset-4'>
          <div className='form-login mb-4'>
            <h2 className="text-center mt-4">Create New User</h2>
            <form>
              <div className="form-group mt-3">
                <label htmlFor="firstName">First Name</label>
                <input className="form-control" type="text" onChange={(e) => {
                    setFirstName(e.target.value);
                }} />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input className="form-control" type="text" onChange={(e) => {
                    setLastName(e.target.value);
                }} />
              </div>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input 
                  className="form-control"
                  type="text"
                  onChange={(e) => {
                      setUsername(e.target.value);
                  }}
                  />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input className="form-control" type="email" onChange={(e) => {
                    setEmail(e.target.value);
                }} />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                  <input 
                    className="form-control"
                    type="password"
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                    />
              </div>
              <button type="submit" className="btn btn-primary btn-block" onClick={submit}>Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register;
