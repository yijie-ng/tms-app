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

  return (
    <table className="table table-hover">
      <thead>
        <tr>
          <th scope="col">First Name</th>
          <th scope="col">Last Name</th>
          <th scope="col">Username</th>
          <th scope="col">Email</th>
          <th scope="col">Title</th>
          <th scope="col">User Role</th>
          <th scope="col">Status</th>
          <th scope="col">Update</th>
        </tr>
      </thead>
      <tbody>
        {userData.map((data) => {
          return (
            <tr>
              <td>{data.firstName}</td>
              <td>{data.lastName}</td>
              <td>{data.username}</td>
              <td>{data.email}</td>
              <td>{data.user_title}</td>
              <td>{data.user_role}</td>
              <td>{data.status}</td>
              <td>
                <Link to="/update/user">
                  <button
                    className="btn btn-warning"
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
  );
}

export default User;
