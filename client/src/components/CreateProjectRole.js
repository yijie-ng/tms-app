import React, { useState, useEffect } from "react";
import axios from "axios";
import "../assets/Login.css";
import useAuth from "../hooks/useAuth";
import Disabled from "./Disabled";

const CreateProjectRole = () => {
  const [projectRoleData, setProjectRoleData] = useState([]);
  const [projectRole, setProjectRole] = useState("");
  const [msg, setMsg] = useState("");
  const [networkStatus, setNetworkStatus] = useState("pending");

  const { auth } = useAuth();

  axios.defaults.withCredentials = true;

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/user-titles"
        );
        setProjectRoleData(response.data);
        setNetworkStatus("resolved");
      } catch (error) {
        console.log("error", error);
      }
    };
    getData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/api/user-titles/create", {
        projectRole: projectRole,
      })
      .then((response) => {
        if (response.data.message === "New project role created!") {
          alert(response.data.message);
          window.location.reload(true);
        } else {
          setMsg(response.data.message);
        }
      });
  };

  console.log(projectRole);

  return (
    <>
      {networkStatus === "resolved" ? (
        <div className="container">
          {auth.userStatus === "active" ? (
            <>
              <div className="row">
                <div className="col-xs-12 col-sm-6 col-sm-offset-4">
                  <div className="form-login mb-4">
                    <h2 className="text-center mt-4">
                      Create New Project Role
                    </h2>
                    <form onSubmit={handleSubmit}>
                      <div
                        className={msg ? "alert alert-info" : "offscreen"}
                        role="alert"
                      >
                        {msg}
                      </div>
                      <div className="form-group mt-3">
                        <label htmlFor="title">Add Project Role:</label>
                        <input
                          className="form-control"
                          type="text"
                          id="title"
                          required
                          autoComplete="off"
                          onChange={(e) => {
                            setProjectRole(e.target.value);
                          }}
                        />
                      </div>
                      <button
                        type="submit"
                        className="btn btn-primary btn-block"
                      >
                        Save
                      </button>
                    </form>
                  </div>
                </div>
                <div className="col-xs-12 col-sm-6 col-sm-offset-4">
                    <table className="table table-hover mt-4">
                      <thead className="thead-dark">
                        <tr>
                          <th scope="col">Project Roles</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projectRoleData.map((roles) => {
                          return (
                            <tr key={roles.id}>
                              <td>{roles.title}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
              </div>
            </>
          ) : (
            <Disabled />
          )}
        </div>
      ) : null}
    </>
  );
};

export default CreateProjectRole;
