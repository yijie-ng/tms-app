import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import axios from "axios";

const Users = () => {
  const [usersData, setUsersData] = useState([]);

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get("http://localhost:3001/users").then((response) => {
      setUsersData(response.data);
    });
  }, []);

  const [id, setID] = useState(null);

  const setData = (users) => {
    let { id, firstName, lastName, email, user_title, user_role, status } = users;
    localStorage.setItem("ID", id);
    localStorage.setItem("First Name", firstName);
    localStorage.setItem("Last Name", lastName);
    localStorage.setItem("Email", email);
    localStorage.setItem("User Title", user_title);
    localStorage.setItem("User Role", user_role);
    localStorage.setItem("Status", status);
  };

  useEffect(() => {
    setID(localStorage.getItem("ID"));
  }, []);


  const [usersGroupData, setUsersGroupData] = useState([]);

  useEffect(() => {
      axios.get("http://localhost:3001/api/usersgroups").then((response) => {
          setUsersGroupData(response.data);
      });
  });

  return (
    <div className="table-responsive-xl">
      <table className="table table-hover">
        <thead className="thead-dark">
          <tr>
            <th scope="col">First Name</th>
            <th scope="col">Last Name</th>
            <th scope="col">Username</th>
            <th scope="col">Email</th>
            <th scope="col">Title</th>
            <th scope="col">User Group</th>
            <th scope="col">User Role</th>
            <th scope="col">Status</th>
            <th scope="col">Update User</th>
          </tr>
        </thead>
        <tbody>
          {usersData.map((users) => {
            return (
              <tr key={users.id}>
                <td>{users.firstName}</td>
                <td>{users.lastName}</td>
                <td>{users.username}</td>
                <td>{users.email}</td>
                <td>{users.user_title}</td>
                <td>
                  {usersGroupData.map((group) => {
                    if (group.username === users.username) {
                        return (
                            <ul>
                                <li>{group.group_name}</li>
                            </ul>
                        )
                    } else null
                  })}
                    <button className="btn btn-success btn-sm btn-block">Add</button>
                    <button className="btn btn-danger btn-sm btn-block">Remove</button>
                </td>
                <td>{users.user_role}</td>
                <td>
                    {users.status}
                    {/* <form onSubmit={handleSubmit}>
                        <label htmlFor="status">{users.status}</label>
                      <select
                        className="form-control form-control-sm"
                        id="status"
                        value={users.status}
                        onChange={(e) => {
                          setUserStatus(e.target.value);
                          setData(users);
                          console.log(userStatus)
                        }}
                      >
                        <option value="">Update status!</option>
                        <option value="active">active</option>
                        <option value="disabled">disabled</option>
                      </select>
                      <button
                        type="submit"
                        className="btn btn-primary btn-sm btn-block"
                      >
                        Save
                      </button>
                    </form> */}
                </td>
                <td>
                  <Link to="/admin/update/user">
                    <button
                      className="btn btn-success"
                      onClick={() => setData(users)}
                    >
                      Update
                    </button>
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
