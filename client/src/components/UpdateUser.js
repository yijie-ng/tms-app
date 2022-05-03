import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/Login.css";
import useAuth from "../hooks/useAuth";
import Disabled from "./Disabled";
import {
    faCheck,
    faTimes,
    faInfoCircle,
  } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,10}$/;
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

function UpdateUser() {
    const emailRef = useRef();

    const { auth } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [password, setPassword] = useState("");
    const [validPassword, setValidPassword] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);
  
    const [matchPassword, setMatchPassword] = useState("");
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [networkStatus, setNetworkStatus] = useState("pending");
    const userID = auth.id;
    const [emailMsg, setEmailMsg] = useState("");
    const [pwdMsg, setPwdMsg] = useState("");
    
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

    useEffect(() => {
        const result = EMAIL_REGEX.test(email);
        setValidEmail(result);
    }, [email]);

    useEffect(() => {
        const result = PWD_REGEX.test(password);
        setValidPassword(result);
        const match = password === matchPassword; // comparing password to matchPassword state
        setValidMatch(match);
    }, [password, matchPassword]);

    const updateUserEmail = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:3001/users/update-email/${userID}`, {
            email
        }).then((response) => {
            if (response.data.message === 'Email updated!') {
                alert(response.data.message);
                navigate('/dashboard')
            } else {
                setEmailMsg(response.data.message);
            }
        });
    };

    const updateUserPassword = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:3001/users/update-password/${userID}`, {
            password
        }).then((response) => {
            if (response.data.message === 'Password updated!') {
                alert(response.data.message);
                navigate('/dashboard')
            } else {
                setPwdMsg(response.data.message);
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
                    <div
                    className={emailMsg ? "alert alert-danger" : "offscreen"}
                    role="alert"
                  >
                    {emailMsg}
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">
                            Email:
                            <span className={validEmail ? "valid" : "d-none"}>
                                <FontAwesomeIcon icon={faCheck} />
                            </span>
                            <span className={validEmail || !email ? "d-none" : "invalid"}>
                                <FontAwesomeIcon icon={faTimes} />
                            </span>
                        </label>
                        <input className="form-control" type="email" id="email" ref={emailRef} placeholder="Email" autoComplete="off" value={email} onChange={(e) => {
                            setEmail(e.target.value);
                        }} onFocus={() => setEmailFocus(true)} onBlur={() => setEmailFocus(false)} />
                        <p id="emailnote" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                          <FontAwesomeIcon icon={faInfoCircle} />
                          Must be a valid email address.
                        </p>
                    </div>
                    <button disabled={!validEmail ? true : false} type="submit" className="btn btn-primary btn-block">Save</button>
                    </form>
                    <form className="mt-3" onSubmit={updateUserPassword}>
                    <div
                    className={pwdMsg ? "alert alert-danger" : "offscreen"}
                    role="alert"
                  >
                    {pwdMsg}
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">
                            Password:
                            <span className={validPassword ? "valid" : "d-none"}>
                                <FontAwesomeIcon icon={faCheck} />
                            </span>
                            <span className={validPassword || !password ? "d-none" : "invalid"}>
                                <FontAwesomeIcon icon={faTimes} />
                            </span>
                        </label>
                        <input 
                            className="form-control"
                            type="password"
                            id="password"
                            required
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                            onFocus={() => setPasswordFocus(true)}
                            onBlur={() => setPasswordFocus(false)}
                        />
                        <p id="pwdnote" className={passwordFocus && !validPassword ? "instructions" : "offscreen"}>
                          <FontAwesomeIcon icon={faInfoCircle} />
                          8 to 10 characters.<br/>
                          Must include uppercase and lowercase letters, a number and a special character.<br/>
                          Allowed special characters: !@#$%
                        </p>
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirm-password">
                          Confirm Password:
                          <span className={validMatch && matchPassword ? "valid" : "d-none"}>
                            <FontAwesomeIcon icon={faCheck} />
                          </span>
                          <span className={validMatch || !matchPassword ? "d-none" : "invalid"}>
                            <FontAwesomeIcon icon={faTimes} />
                          </span>
                        </label>
                        <input
                          className="form-control"
                          type="password"
                          id="confirm-password"
                          required
                          onChange={(e) => {
                            setMatchPassword(e.target.value);
                          }}
                          onFocus={() => setMatchFocus(true)}
                          onBlur={() => setMatchFocus(false)}
                        />
                        <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                          <FontAwesomeIcon icon={faInfoCircle} />
                          Must match the first password input field.
                        </p>
                    </div>
                    <button disabled={!validPassword || !validMatch ? true :false} type="submit" className="btn btn-primary btn-block">Save</button>
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
