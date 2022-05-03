import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/Login.css";
import useAuth from "../hooks/useAuth";
import Disabled from "./Disabled";

function UpdateUser() {
    const { auth } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [networkStatus, setNetworkStatus] = useState("pending");
    const userID = auth.id;
    
    axios.defaults.withCredentials = true;
    
    useEffect(() => {
        const getData = async () => {
            try {
                const getUser = await axios.get(`http://localhost:3001/users/${userID}`);
                setNetworkStatus("loading");
                setEmail((getUser.data)[0].email);
                setNetworkStatus("resolved");
            } catch (error) {
                console.log("error", error);
            }
        };
        getData();
    }, []);

    const updateUserEmail = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:3001/users/update-email/${userID}`, {
            email
        }).then((response) => {
            if (response.data.message === 'Email updated!') {
                alert(response.data.message);
                navigate('/dashboard')
            } else {
                alert(response.data.message);
            }
        });
    };

    const updateUserPassword = () => {
        axios.put(`http://localhost:3001/users/update-password/${userID}`, {
            password
        }).then((response) => {
            if (response.data.message === 'Password updated!') {
                alert(response.data.message);
                navigate('/dashboard')
            } else {
                alert(response.data.message);
            }
        });
    };

  return (
      <>
      {networkStatus === "resolved" ? (<div className='container'>
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
    </div>) : null}
      </>
  );
}

export default UpdateUser;
