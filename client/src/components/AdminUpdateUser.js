import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/Login.css";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import Disabled from "./Disabled";
import MultiSelect from "react-multiple-select-dropdown-lite";
import "react-multiple-select-dropdown-lite/dist/index.css";

const AdminUpdateUser = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userTitle, setUserTitle] = useState("");
  const [removeUserTitle, setRemoveUserTitle] = useState("");
  const [userStatus, setUserStatus] = useState("");
  const [username, setUsername] = useState("");
  const [userRoleData, setUserRoleData] = useState([]);
  const [userTitleData, setUserTitleData] = useState([]);
  const [id, setID] = useState(null);

  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const { auth } = useAuth();

  useEffect(() => {
    setID(localStorage.getItem("ID"));
    setUsername(localStorage.getItem("Username"));
    setFirstName(localStorage.getItem("First Name"));
    setLastName(localStorage.getItem("Last Name"));
    setEmail(localStorage.getItem("Email"));
    setUserRole(localStorage.getItem("User Role"));
    setUserStatus(localStorage.getItem("Status"));
  }, []);

  axios.defaults.withCredentials = true;

  const handleSubmit = (e) => {
    // e.preventDefault();
    axios
      .put(`http://localhost:3001/users/update-user/${id}`, {
        firstName: firstName,
        lastName: lastName,
        email: email,
        userRole: userRole,
        userStatus: userStatus,
      })
      .then((response) => {
        if (response.data.message === "User updated!") {
          alert(response.data.message);
        //   navigate("/dashboard");
        } else {
          setMsg(response.data.message);
        }
      });
  };

  console.log(email);

  const updateUserPassword = () => {
    axios
      .put(`http://localhost:3001/users/update-password/${id}`, {
        password,
      })
      .then((response) => {
        if (response.data.message === "Password updated!") {
          alert(response.data.message);
          navigate("/dashboard");
        } else {
          alert(response.data.message);
        }
      });
  };
  // to add another post to another table
  const addUsersTitles = (e) => {
    e.preventDefault();
    axios
      .put("http://localhost:3001/api/users-titles/add", {
        userTitle: userTitle,
        username: username,
        status: "assigned",
      })
      .then((response) => {
        if (
          response.data.message === "New project roles assigned to user successfully!"
        ) {
          alert(response.data.message);
          navigate("/dashboard");
        } else {
          alert(response.data.message);
        }
      });
  };

  // to update user_title_user table and audit table
  const removeUsersTitles = (e) => {
    e.preventDefault();
    axios
      .put("http://localhost:3001/api/users-titles/remove", {
        userTitle: removeUserTitle,
        username: username,
        status: "unassigned",
      })
      .then((response) => {
        if (response.data.message === "Project Role removed from user successfully!") {
          alert(response.data.message);
          navigate("/dashboard");
        } else {
          alert(response.data.message);
        }
      });
  };

  useEffect(() => {
    axios.get("http://localhost:3001/api/user-roles").then((response) => {
      setUserRoleData(response.data);
    });
  }, []);

  useEffect(() => {
    axios.get("http://localhost:3001/api/user-titles").then((response) => {
      setUserTitleData(response.data);
    });
  }, []);

  const addTitleOptions = [];
  const removeTitleOptions = [];
  userTitleData.map((titleData) => {
    axios
      .get(
        `http://localhost:3001/api/checkgroup/${titleData.title}/${username}`
      )
      .then((response) => {
        if (response.data.isInGroup === false) {
          const titleOption = {
            label: titleData.title,
            value: titleData.title,
          };
          addTitleOptions.push(titleOption);
        } else {
          const removeTitleOption = {
            label: titleData.title,
            value: titleData.title,
          };
          removeTitleOptions.push(removeTitleOption);
        }
      });
  });

  const handleAddTitleOptions = (opt) => {
    setUserTitle(opt.split(","));
  };

  const handleRemoveTitleOptions = (opt) => {
    setRemoveUserTitle(opt.split(","));
  };

  return (
    <div className="container">
      {auth.userStatus === "active" ? (
        <>
          <div className="row">
            <div className="col-xs-12 col-sm-6 col-sm-offset-4">
              <div className="form-login mb-4">
                <h2 className="text-center mt-4">Update User Details</h2>
                <form onSubmit={handleSubmit}>
                  <div
                    className={msg ? "alert alert-danger" : "offscreen"}
                    role="alert"
                  >
                    {msg}
                  </div>
                  <div className="form-group mt-3">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      className="form-control"
                      type="text"
                      id="firstName"
                      required
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      className="form-control"
                      type="text"
                      id="lastName"
                      required
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value);
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      className="form-control"
                      type="email"
                      id="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="user_role">Account Type</label>
                    <select
                      className="form-control"
                      id="user_role"
                      required
                      value={userRole}
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
                    <label htmlFor="status">Status</label>
                    <select
                      className="form-control"
                      id="status"
                      value={userStatus}
                      onChange={(e) => {
                        setUserStatus(e.target.value);
                      }}
                    >
                      <option value="">Choose status!</option>
                      <option value="active">active</option>
                      <option value="disabled">disabled</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary btn-block">
                    Save
                  </button>
                </form>
                <h2 className="text-center mt-4">Update User Password</h2>
                <form onSubmit={updateUserPassword}>
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
                  <button type="submit" className="btn btn-primary btn-block">
                    Save
                  </button>
                </form>
              </div>
            </div>
            <div className="col-xs-12 col-sm-6 col-sm-offset-4">
              <div className="form-login mb-4">
                <h2 className="text-center mt-4">Update Project Roles</h2>
                <form className="form-inline" onSubmit={addUsersTitles}>
                  <div className="form-group">
                    <label htmlFor="user_title_user" className="mr-2">
                      Add Role:
                    </label>
                    <MultiSelect
                      options={addTitleOptions}
                      onChange={handleAddTitleOptions}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary ml-2">
                    Add
                  </button>
                </form>
                <h2 className="text-center mt-4">Current Assigned Roles</h2>
                <form className="form-inline" onSubmit={removeUsersTitles}>
                  <div className="form-group">
                    <label htmlFor="user_title_user" className="mr-2">
                      Remove Role:
                    </label>
                    <MultiSelect
                      options={removeTitleOptions}
                      onChange={handleRemoveTitleOptions}
                    />
                  </div>
                  <button type="submit" className="btn btn-danger ml-2">
                    Remove
                  </button>
                </form>
              </div>
            </div>
            {/* <div className="col-xs-12 col-sm-4 col-sm-offset-4">
                        <div className="form-login mb-4">
                            <h2 className="text-center mt-4">Update Project Groups</h2>
                            <form>
                                <div className="form-group">
                                            <label htmlFor="user_group_users">Project Group</label>
                                </div>
                            </form>
                            <button type="submit" className="btn btn-primary btn-block">
                                    Add
                            </button>
                        </div>
                    </div> */}
          </div>
        </>
      ) : (
        <Disabled />
      )}
    </div>
  );
};

export default AdminUpdateUser;
