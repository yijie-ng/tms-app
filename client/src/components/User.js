import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import axios from "axios";
import {
    faCheck,
    faTimes,
  } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../assets/Users.css";

function User() {
  const { auth } = useAuth();
  const userId = auth.id;
  const [userData, setUserData] = useState([]);
  const [userTitleData, setUserTitleData] = useState([]);
  const [networkStatus, setNetworkStatus] = useState("pending");

  axios.defaults.withCredentials = true;

  useEffect(() => {
      const getData = async () => {
          try {
            const getUser = await axios.get(`http://localhost:3001/users/${userId}`);
            const userTitles = await axios.get("http://localhost:3001/api/users-titles");
            setUserData(getUser.data);
            setUserTitleData(userTitles.data);
            setNetworkStatus("resolved");
          } catch (error) {
              console.log("error", error);
          }
      };
      getData();
   }, []);

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
                <th scope="col">User Group</th>
                {/* <th scope="col">Project Groups</th> */}
                <th scope="col">User Role</th>
                <th scope="col">Status</th>
                <th scope="col">Update User</th>
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
                    {/* <td>Insert project roles</td> */}
                    <td>{userTitleData.map((titleData) => {
                        if (titleData.username === data.username && (titleData.status === "assigned")) {
                            return (
                                <>
                                    <li key={titleData.id}>{titleData.user_title}</li>
                                </>
                            )
                        } else null
                    })}</td>
                    {/* <td>Insert project group</td> */}
                    <td>{data.user_role}</td>
                    <td>{data.status === "active" ? <span className="active" data-toggle="tooltip" data-placement="bottom" title="Active"><FontAwesomeIcon icon={faCheck} /></span> : <span className="disabled" data-toggle="tooltip" data-placement="bottom" title="Disabled"><FontAwesomeIcon icon={faTimes} /></span>}</td>
                    <td>
                    <Link to="/update/user">
                        <button
                        className="btn btn-warning"
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
}

export default User;
