import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/Login.css";
import axios from "axios";

const AdminUpdateUser = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userTitle, setUserTitle] = useState("");
  const [userStatus, setUserStatus] = useState("");
  const [userRoleData, setUserRoleData] = useState([]);
  const [userTitleData, setUserTitleData] = useState([]);
  const [id, setID] = useState(null);

  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setID(localStorage.getItem("ID"));
    setFirstName(localStorage.getItem("First Name"));
    setLastName(localStorage.getItem("Last Name"));
    setEmail(localStorage.getItem("Email"));
    setUserRole(localStorage.getItem("User Role"));
    setUserTitle(localStorage.getItem("User Title"));
    setUserStatus(localStorage.getItem("Status"));
  }, []);

  axios.defaults.withCredentials = true;

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:3001/users/update-user/${id}`, {
        firstName: firstName,
        lastName: lastName,
        email: email,
        userRole: userRole,
        userTitle: userTitle,
        userStatus: userStatus
      })
      .then((response) => {
        if (response.data.message === "User updated!") {
          setMsg(response.data.message);
          navigate("/dashboard");
        } else {
          setMsg(response.data.message);
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

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-xs-12 col-sm-4 col-sm-offset-4">
          <div className="form-login mb-4">
            <h2 className="text-center mt-4">Update User Details</h2>
            <form onSubmit={handleSubmit}>
              <div
                className={msg ? "alert alert-info" : "offscreen"}
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
                <label htmlFor="user_role">Role</label>
                <select
                  className="form-control"
                  id="user_role"
                  required
                  value={userRole}
                  onChange={(e) => {
                    setUserRole(e.target.value);
                  }}
                >
                  <option value="">Choose role!</option>
                  {userRoleData.map((data) => {
                    return <option key={data.role} value={data.role}>{data.role}</option>;
                  })}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="user_title">Title</label>
                <select
                  className="form-control"
                  id="user_title"
                  required
                  value={userTitle}
                  onChange={(e) => {
                    setUserTitle(e.target.value);
                  }}
                >
                  <option value="">Choose title!</option>
                  {userTitleData.map((data) => {
                    return <option key={data.title} value={data.title}>{data.title}</option>;
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
      </div>
    </div>
  );
};

export default AdminUpdateUser;
