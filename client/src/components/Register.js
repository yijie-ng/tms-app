import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/Login.css";
import axios from "axios";
import MultiSelect from "react-multiple-select-dropdown-lite";
import "react-multiple-select-dropdown-lite/dist/index.css";
import useAuth from "../hooks/useAuth";
import Disabled from "./Disabled";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,10}$/;
const FIRSTNAME_REGEX = /^[a-zA-Z-/\s]{2,30}$/;
const LASTNAME_REGEX = /^[a-zA-Z-/\s]{2,30}$/;
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

function Register() {
  const usernameRef = useRef();
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const errRef = useRef();

  const [firstName, setFirstName] = useState("");
  const [validFirstName, setValidFirstName] = useState(false);
  const [firstNameFocus, setFirstNameFocus] = useState(false);

  const [lastName, setLastName] = useState("");
  const [validLastName, setValidLastName] = useState(false);
  const [lastNameFocus, setLastNameFocus] = useState(false);

  const [username, setUsername] = useState("");
  const [validUsername, setValidUsername] = useState(false);
  const [usernameFocus, setUsernameFocus] = useState(false);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [matchPassword, setMatchPassword] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [userRole, setUserRole] = useState("");
  const [userTitle, setUserTitle] = useState("");
  // const [userGroup, setUserGroup] = useState("");

  // const [userGroupData, setUserGroupData] = useState([]);
  const [userRoleData, setUserRoleData] = useState([]);
  const [userTitleData, setUserTitleData] = useState([]);

  const [errMsg, setErrMsg] = useState("");
  const [succes, setSuccess] = useState(false);

  const [networkStatus, setNetworkStatus] = useState("pending");

  const { auth } = useAuth();
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  // setting the focus when component loads
  // useEffect(() => {
  //   firstNameRef.current.focus();
  // }, []);

  useEffect(() => {
    const result = FIRSTNAME_REGEX.test(firstName);
    setValidFirstName(result);
  }, [firstName]);

  useEffect(() => {
    const result = LASTNAME_REGEX.test(lastName);
    setValidLastName(result);
  }, [lastName]);

  useEffect(() => {
    const result = USER_REGEX.test(username);
    setValidUsername(result);
  }, [username]);

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

  useEffect(() => {
    setErrMsg("");
  }, [firstName, lastName, username, email, password, matchPassword]);

  useEffect(() => {
    const getData = async () => {
      try {
        // const allProjectGroups = await axios.get('http://localhost:3001/api/user-groups');
        const allAccTypes = await axios.get(
          "http://localhost:3001/api/user-roles"
        );
        const allProjectRoles = await axios.get(
          "http://localhost:3001/api/user-titles"
        );
        // setUserGroupData(allProjectGroups.data);
        setUserRoleData(allAccTypes.data);
        setUserTitleData(allProjectRoles.data);
        setNetworkStatus("resolved");
      } catch (error) {
        console.log("error", error);
      }
    };
    getData();
  }, []);

  const titleOptions = [];
  userTitleData.map((data) => {
    const titleOption = {
      label: data.title,
      value: data.title,
    };
    titleOptions.push(titleOption);
  });

  const handleTitleOptions = (opt) => {
    setUserTitle(opt.split(","));
  };

  // const groupOptions = [];
  // userGroupData.map((data) => {
  //   const option = {
  //     label: data.group_name,
  //     value: data.group_name
  //   };
  //   groupOptions.push(option);
  // });

  // const handleGroupOptions = val => {
  //   setUserGroup(val.split(","));
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    // if button enabled with JS hack
    const v1 = USER_REGEX.test(username);
    const v2 = PWD_REGEX.test(password);
    const v3 = EMAIL_REGEX.test(email);
    const v4 = FIRSTNAME_REGEX.test(firstName);
    const v5 = LASTNAME_REGEX.test(lastName);
    if (!v1 || !v2 || !v3 || !v4 || !v5) {
      setErrMsg("Invalid entry!");
      return;
    };

    axios
      .post("http://localhost:3001/users/register", {
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email,
        password: password,
        userRole: userRole,
        userTitle: userTitle,
        // userGroup: userGroup,
        projectRoleStatus: "assigned",
      })
      .then((response) => {
        if (response.data.message === "User created successfully!") {
          alert(response.data.message);
          window.location.reload(true);
        } else {
          setErrMsg(response.data.message);
        }
      });
  };

  return (
    <>
      {networkStatus === "resolved" ? (
        <div className="container">
          {auth.userStatus === "active" ? (
            <>
              <div className="row justify-content-center">
                <div className="col-xs-12 col-sm-4 col-sm-offset-4">
                  <div className="form-login mb-4">
                    <h2 className="text-center mt-4">Create New User</h2>
                    <form onSubmit={handleSubmit}>
                      <div
                        ref={errRef}
                        className={errMsg ? "alert alert-info" : "offscreen"}
                        role="alert"
                      >
                        {errMsg}
                      </div>
                      <div className="form-group mt-3">
                        <label htmlFor="firstName">
                          First Name:
                          <span className={validFirstName ? "valid" : "d-none"}>
                            <FontAwesomeIcon icon={faCheck} />
                          </span>
                          <span className={validFirstName || !firstName ? "d-none" : "invalid"}>
                            <FontAwesomeIcon icon={faTimes} />
                          </span>
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          id="firstName"
                          ref={firstNameRef}
                          autoComplete="off"
                          required
                          onChange={(e) => setFirstName(e.target.value)}
                          onFocus={() => setFirstNameFocus(true)}
                          onBlur={() => setFirstNameFocus(false)}
                        />
                        {/* if firstNameFocus is true, and if firstName state exists, and if there is not a valid name */}
                        <p id="firstnamenote" className={firstNameFocus && firstName && !validFirstName ? "instructions" : "offscreen"}>
                          <FontAwesomeIcon icon={faInfoCircle} />
                          2 to 30 characters.<br />
                          Must begin with a letter.<br />
                          Letters, hyphens, and slashes allowed.
                        </p>
                      </div>
                      <div className="form-group">
                        <label htmlFor="lastName">
                          Last Name:
                          <span className={validLastName ? "valid" : "d-none"}>
                            <FontAwesomeIcon icon={faCheck} />
                          </span>
                          <span className={validLastName || !lastName ? "d-none" : "invalid"}>
                            <FontAwesomeIcon icon={faTimes} />
                          </span>
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          id="lastName"
                          ref={lastNameRef}
                          autoComplete="off"
                          required
                          onChange={(e) => {
                            setLastName(e.target.value);
                          }}
                          onFocus={() => setLastNameFocus(true)}
                          onBlur={() => setLastNameFocus(false)}
                        />
                        <p id="lastnamenote" className={lastNameFocus && lastName && !validLastName ? "instructions" : "offscreen"}>
                          <FontAwesomeIcon icon={faInfoCircle} />
                          2 to 30 characters.<br />
                          Must begin with a letter.<br />
                          Letters, hyphens, and slashes allowed.
                        </p>
                      </div>
                      <div className="form-group">
                        <label htmlFor="username">
                          Username:
                          <span className={validUsername ? "valid" : "d-none"}>
                            <FontAwesomeIcon icon={faCheck} />
                          </span>
                          <span className={validUsername || !username ? "d-none" : "invalid"}>
                            <FontAwesomeIcon icon={faTimes} />
                          </span>
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          id="username"
                          ref={usernameRef}
                          autoComplete="off"
                          required
                          onChange={(e) => {
                            setUsername(e.target.value);
                          }}
                          onFocus={() => setUsernameFocus(true)}
                          onBlur={() => setUsernameFocus(false)}
                        />
                        <p id="usernote" className={usernameFocus && username && !validUsername ? "instructions" : "offscreen"}>
                          <FontAwesomeIcon icon={faInfoCircle} />
                          4 to 24 characters.<br />
                          Must begin with a letter.<br />
                          Letters, numbers, underscores, hyphens allowed.
                        </p>
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
                        <input
                          className="form-control"
                          type="email"
                          id="email"
                          ref={emailRef}
                          autoComplete="off"
                          required
                          onChange={(e) => {
                            setEmail(e.target.value);
                          }}
                          onFocus={() => setEmailFocus(true)}
                          onBlur={() => setEmailFocus(false)}
                        />
                        <p id="emailnote" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                          <FontAwesomeIcon icon={faInfoCircle} />
                          Must be a valid email address.
                        </p>
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
                      <div className="form-group">
                        <label htmlFor="user_role">
                          Account Type:
                        </label>
                        <select
                          className="form-control"
                          id="user_role"
                          required
                          onChange={(e) => {
                            setUserRole(e.target.value);
                          }}
                        >
                          <option value="">Choose type!</option>
                          {userRoleData.map((data) => {
                            return (
                              <option key={data.role} value={data.role}>
                                {data.role}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="user_title">
                          Project Role:
                        </label>
                        <MultiSelect
                          options={titleOptions}
                          onChange={handleTitleOptions}
                        />
                      </div>
                      {/* <div className='form-group'>
                        <label htmlFor="group_name">Project Group</label>
                        <MultiSelect options={groupOptions} onChange={handleGroupOptions}/>
                      </div> */}
                      <button
                        disabled={!validFirstName || !validLastName || !validUsername || !validEmail || !validPassword || !validMatch ? true : false}
                        type="submit"
                        className="btn btn-primary btn-block"
                      >
                        Submit
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <Disabled />
          )}
        </div>
      ) : null}
    </>
  );
}

export default Register;
