import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import '../assets/Login.css';
import axios from 'axios';
import MultiSelect from 'react-multiple-select-dropdown-lite';
import 'react-multiple-select-dropdown-lite/dist/index.css';
import useAuth from '../hooks/useAuth';
import Disabled from './Disabled';

function Register() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userRole, setUserRole] = useState("");
    const [userTitle, setUserTitle] = useState("");
    const [userGroup, setUserGroup] = useState("");

    const [userGroupData, setUserGroupData] = useState([]); 
    const [userRoleData, setUserRoleData] = useState([]);
    const [userTitleData, setUserTitleData] = useState([]);

    const [networkStatus, setNetworkStatus] = useState("pending");

    const { auth } = useAuth();

    axios.defaults.withCredentials = true;

    useEffect(() => {
      const getData = async () => {
        try {
          const allProjectGroups = await axios.get('http://localhost:3001/api/user-groups')
          const allAccTypes = await axios.get('http://localhost:3001/api/user-roles');
          const allProjectRoles = await axios.get('http://localhost:3001/api/user-titles');
          setUserGroupData(allProjectGroups.data);
          setUserRoleData(allAccTypes.data);
          setUserTitleData(allProjectRoles.data);
          setNetworkStatus("resolved");
        } catch (error) {
          console.log("error", error);
        }
      };
      getData();
    }, []);

    // useEffect(() => {
    //   axios.get('http://localhost:3001/api/user-groups').then((response) => {
    //     setUserGroupData(response.data);
    //   })
    // }, []);

    // useEffect(() => {
    //   axios.get('http://localhost:3001/api/user-roles').then((response) => {
    //     setUserRoleData(response.data);
    //   })
    // }, []);

    // useEffect(() => {
    //   axios.get('http://localhost:3001/api/user-titles').then((response) => {
    //     setUserTitleData(response.data);
    //   })
    // }, []);

    const groupOptions = [];
    userGroupData.map((data) => {
      const option = {
        label: data.group_name,
        value: data.group_name
      };
      groupOptions.push(option);
    });

    const titleOptions = [];
    userTitleData.map((data) => {
      const titleOption = {
        label: data.title,
        value: data.title
      };
      titleOptions.push(titleOption);
    });

    const handleGroupOptions = val => {
      setUserGroup(val.split(","));
    };

    const handleTitleOptions = opt => {
      setUserTitle(opt.split(","));
    };

    console.log(userTitle);
    console.log(userGroup);

    const [msg, setMsg] = useState("");
    const navigate = useNavigate();

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
            userGroup: userGroup,
            projectRoleStatus: 'assigned'
        }).then((response) => {
            if (response.data.message === "User created successfully!") {
              alert(response.data.message);
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
    <>
    {networkStatus === "resolved" ? (
      <div className='container'>
        {auth.userStatus === 'active' 
          ? <>
              <div className='row justify-content-center'>
                <div className='col-xs-12 col-sm-4 col-sm-offset-4'>
                  <div className='form-login mb-4'>
                    <h2 className="text-center mt-4">Create New User</h2>
                    <form onSubmit={handleSubmit}>
                      <div className={msg ? "alert alert-info" : "offscreen"} role="alert">
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
                        <label htmlFor="user_role">Account Type</label>
                        <select className="form-control" id="user_role" required onChange={(e) => {
                          setUserRole(e.target.value);
                        }}>
                          <option value="">Choose type!</option>
                          {userRoleData.map((data) => {
                            return (
                              <option key={data.role} value={data.role}>{data.role}</option>
                            )
                          })}
                        </select>
                      </div>
                      <div className='form-group'>
                        <label htmlFor="user_title">Project Role</label>
                        <MultiSelect options={titleOptions} onChange={handleTitleOptions}/>
                        {/* <select className="form-control" id="user_title" required onChange={(e) => {
                          setUserTitle(e.target.value);
                        }}>
                          <option value="">Choose title!</option>
                          {userTitleData.map((data) => {
                            return (
                              <option key={data.title} value={data.title}>{data.title}</option>
                            )
                          })}
                        </select> */}
                      </div>
                      <div className='form-group'>
                        <label htmlFor="group_name">Project Group</label>
                        <MultiSelect options={groupOptions} onChange={handleGroupOptions}/>
                      </div>
                      <button type="submit" className="btn btn-primary btn-block">Submit</button>
                    </form>
                  </div>
                </div>
              </div>
            </>
          : <Disabled />
        }
      </div>
    ) : null}
    </>
  )
}

export default Register;
