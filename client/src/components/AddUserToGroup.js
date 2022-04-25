import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/Login.css";
import axios from "axios";
import MultiSelect from "react-multiple-select-dropdown-lite";
import "react-multiple-select-dropdown-lite/dist/index.css";

const AddUserToGroup = () => {
  const [userGroupData, setUserGroupData] = useState([]);
  const [usersGroupsData, setUsersGroupsData] = useState([]);

  const options = [];
  userGroupData.map((data) => {
    const option = {
      label: data.group_name,
      value: data.group_name
    };
    options.push(option);
  });

  const handleOnchange = val => {
    setUserGroup(val.split(","));
  };

  useEffect(() => {
    axios.get('http://localhost:3001/api/user-groups').then((response) => {
      setUserGroupData(response.data);
    })
  }, []);

  useEffect(() => {
    axios.get("http://localhost:3001/api/usersgroups").then((response) => {
        setUsersGroupsData(response.data);
    });
});

    const checkgroup = (username, groupName) => {
        
    }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-xs-12 col-sm-4 col-sm-offset-4">
          <div className="form-login mb-4">
            <h2 className="text-center mt-4">Create New User</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="group_name">Group</label>
                <MultiSelect options={options} onChange={handleOnchange} />
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

export default AddUserToGroup;
