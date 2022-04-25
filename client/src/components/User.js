import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import axios from "axios";

function User() {
  const { auth } = useAuth();
  const userId = auth.id;
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:3001/users/${userId}`).then((response) => {
      setUserData(response.data);
    });
  }, []);

  const setData = (data) => {
    let { id, email } = data;
    localStorage.setItem("ID", id);
    localStorage.setItem("Email", email);
  };

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
            <th scope="col">Update</th>
          </tr>
        </thead>
        <tbody>
          {userData.map((data) => {
            return (
              <tr key={data.id}>
                <td>{data.firstName}</td>
                <td>{data.lastName}</td>
                <td>{data.username}</td>
                <td>{data.email}</td>
                <td>{data.user_title}</td>
                <td>{usersGroupData.map((group) => {
                    if (group.username === data.username) {
                        return (
                            <ul>
                                <li key={data.id}>{group.group_name}</li>
                            </ul>
                        )
                    } else null
                  })}</td>
                <td>{data.user_role}</td>
                <td>{data.status}</td>
                <td>
                  <Link to="/update/user">
                    <button
                      className="btn btn-success"
                      onClick={() => setData(data)}
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
}

export default User;
