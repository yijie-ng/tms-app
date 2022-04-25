import React, { useState, useEffect } from "react";
import axios from "axios";
import "../assets/Login.css";
import useAuth from "../hooks/useAuth";

const CreateGroup = () => {
  const [groupName, setGroupName] = useState("");
  const [msg, setMsg] = useState("");

  axios.defaults.withCredentials = true;

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/api/user-groups", {
        groupName: groupName,
      })
      .then((response) => {
        if (response.data.message === "New group created!") {
          setMsg(response.data.message);
          navigate("/admin/new-group");
        } else {
          setMsg(response.data.message);
        }
      });
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-xs-12 col-sm-4 col-sm-offset-4">
          <div className="form-login">
            <h2 className="text-center mt-4">Create New User Group</h2>
            <form onSubmit={handleSubmit}>
              <div
                className={msg ? "alert alert-info" : "offscreen"}
                role="alert"
              >
                {msg}
              </div>
              <div className="form-group mt-3">
                <label htmlFor="group_name">Group Name:</label>
                <input
                  className="form-control"
                  type="text"
                  id="group_name"
                  required
                  onChange={(e) => {
                    setGroupName(e.target.value);
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

export default CreateGroup;
