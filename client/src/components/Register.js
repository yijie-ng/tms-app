import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import '../assets/Login.css';
import axios from 'axios';

function Register() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // const [roles, getRoles] = useState("");
    const [userRole, setUserRole] = useState("");
    const [userTitle, setUserTitle] = useState("");

    const [msg, setMsg] = useState("");
    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/api/auth/register', {
            firstName: firstName,
            lastName: lastName,
            username: username, 
            email: email,
            password: password,
            userRole: userRole,
            userTitle: userTitle,
        }).then((response) => {
            if (response.data.message === "User created successfully!") {
              setMsg(response.data.message);
              navigate('/register')
            } else {
              setMsg(response.data.message);
            }
        }); 
    };

    // const getAllUserRoles = () => {
    //   axios.get('http://localhost:3001/api/user-roles').then((response) => {
    //     const allRoles = response.data;
    //     getRoles(allRoles);
    //   }).catch(error => console.error(`Error: ${error}`));
    // };

    // useEffect(() => {
    //   getAllUserRoles();
    // }, []);

  return (
    <div className='container'>
      <div className='row justify-content-center'>
        <div className='col-xs-12 col-sm-4 col-sm-offset-4'>
          <div className='form-login mb-4'>
            <h2 className="text-center mt-4">Create New User</h2>
            <form onSubmit={handleSubmit}>
              <div className={msg ? "alert alert-danger" : "offscreen"} role="alert">
                  {msg}
              </div>
              <div className="form-group mt-3">
                <label htmlFor="firstName">First Name</label>
                <input className="form-control" type="text" id="firstName" required onChange={(e) => {
                    setFirstName(e.target.value);
                }} />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input className="form-control" type="text" id="lastName" required onChange={(e) => {
                    setLastName(e.target.value);
                }} />
              </div>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input 
                  className="form-control"
                  type="text"
                  id="username"
                  required
                  onChange={(e) => {
                      setUsername(e.target.value);
                  }}
                  />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input className="form-control" type="email" id="email" required onChange={(e) => {
                    setEmail(e.target.value);
                }} />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                  <input 
                    className="form-control"
                    type="password"
                    id="password"
                    required
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                    />
              </div>
              <div className='form-group'>
                <label htmlFor="user_role">Role</label>
                <select className="form-control" id="user_role" required onChange={(e) => {
                  setUserRole(e.target.value);
                }}>
                  <option value="">Choose role!</option>
                  <option value='Admin'>Admin</option>
                  <option value='User'>User</option>
                </select>
              </div>
              <div className='form-group'>
                <label htmlFor="user_title">Title</label>
                <select className="form-control" id="user_title" required onChange={(e) => {
                  setUserTitle(e.target.value);
                }}>
                  <option value="">Choose title!</option>
                  <option value='Engineer'>Engineer</option>
                  <option value='Project Manager'>Project Manager</option>
                  <option value='Project Lead'>Project Lead</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary btn-block">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register;
