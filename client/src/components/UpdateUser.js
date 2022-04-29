import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/Login.css";
import useAuth from "../hooks/useAuth";
import Disabled from "./Disabled";

function UpdateUser() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [id, setID] = useState(null);
    const navigate = useNavigate();
    const { auth } = useAuth();

    useEffect(() => {
        setID(localStorage.getItem("ID"));
        setEmail(localStorage.getItem("Email"));
    }, []);

    axios.defaults.withCredentials = true;

    const updateUserEmail = () => {
        axios.put(`http://localhost:3001/users/update-email/${id}`, {
            email
        }).then((response) => {
            if (response.data.message === 'Email updated!') {
                navigate('/dashboard')
            } else {
                alert(response.data.message);
            }
        });
    };

    const updateUserPassword = () => {
        axios.put(`http://localhost:3001/users/update-password/${id}`, {
            password
        }).then((response) => {
            if (response.data.message === 'Password updated!') {
                navigate('/dashboard')
            } else {
                alert(response.data.message);
            }
        });
    };

  return (
<div className='container'>
    {auth.userStatus === 'active' 
        ? <>
            <div className='row justify-content-center'>
                <div className='col-xs-12 col-sm-4 col-sm-offset-4'>
                <div className='form-login mb-4'>
                    <h2 className="text-center mt-4">Change Email/Password</h2>
                    <form onSubmit={updateUserEmail}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input className="form-control" type="email" id="email" placeholder="Email" value={email} onChange={(e) => {
                            setEmail(e.target.value);
                        }} />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block">Save</button>
                    </form>
                    <form className="mt-3" onSubmit={updateUserPassword}>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            className="form-control"
                            type="password"
                            id="password"
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                            />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block">Save</button>
                    </form>
                </div>
                </div>
            </div>
          </>
        : <Disabled />
    }
    </div>
  );
}

export default UpdateUser;
