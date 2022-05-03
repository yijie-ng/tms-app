import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import axios from "axios";
import {
    faCheck,
    faTimes,
    faInfoCircle,
  } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../assets/Users.css";

const Users = () => {
  const [usersData, setUsersData] = useState([]);
  const [userTitlesData, setUserTitlesData] = useState([]);
  const [networkStatus, setNetworkStatus] = useState("pending");

  axios.defaults.withCredentials = true;

  useEffect(() => {
      const getData = async () => {
          try {
            const allUsers = await axios.get("http://localhost:3001/users");
            const userTitles = await axios.get("http://localhost:3001/api/users-titles");
            setNetworkStatus("loading");
            setUsersData(allUsers.data);
            setUserTitlesData(userTitles.data);
            setNetworkStatus("resolved");
          } catch (error) {
              console.log("error", error);
          }
      };
      getData();
  }, []);

  const [id, setID] = useState(null);

  const setData = (users) => {
    let { id, username, firstName, lastName, email, user_role, status } = users;
    localStorage.setItem("ID", id);
    localStorage.setItem("Username", username);
    localStorage.setItem("First Name", firstName);
    localStorage.setItem("Last Name", lastName);
    localStorage.setItem("Email", email);
    localStorage.setItem("User Role", user_role);
    localStorage.setItem("Status", status);
  };

  useEffect(() => {
    setID(localStorage.getItem("ID"));
  }, []);

//   const [usersGroupData, setUsersGroupData] = useState([]);

//   useEffect(() => {
//     axios.get("http://localhost:3001/api/usersgroups").then((response) => {
//       setUsersGroupData(response.data);
//     });
//   }, []);

  return (
      <>
      {networkStatus === "resolved" ? (
        <div className="table-responsive-xl">
        <table className="table table-hover">
            <thead className="thead-dark">
            <tr>
                <th scope="col">First Name</th>
                <th scope="col">Last Name</th>
                <th scope="col">Username</th>
                <th scope="col">Email</th>
                <th scope="col">Project Roles</th>
                {/* <th scope="col">Project Groups</th> */}
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
                    <td>{userTitlesData.map((titleData) => {
                        if (titleData.username === users.username && (titleData.status === "assigned")) {
                            return (
                                <>
                                    <li key={titleData.id}>{titleData.user_title}</li>
                                </>
                            )
                        } else null
                    })}</td>
                    {/* <td>
                    {usersGroupData.map((group) => {
                        if (group.username === users.username) {
                        return (
                            <>
                            <li key={group.id}>{group.group_name}</li>
                            </>
                        );
                        } else null;
                    })}
                    </td> */}
                    <td>{users.user_role}</td>
                    <td>
                    {users.status === "active" ? 
                        <span className="active" data-toggle="tooltip" data-placement="bottom" title="Active"><FontAwesomeIcon icon={faCheck} /></span> : <span className="disabled" data-toggle="tooltip" data-placement="bottom" title="disabled"><FontAwesomeIcon icon={faTimes} /></span>
                    }
                    </td>
                    <td>
                    <Link to="/admin/update/user">
                        <button
                        className="btn btn-warning"
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
      ) : null}
      </>
  );
};

export default Users;
