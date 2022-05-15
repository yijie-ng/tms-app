import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import useAuth from "../hooks/useAuth";

const CreateTask = () => {
  const { auth } = useAuth();
  const [appRnum, setAppRnum] = useState([]);
  const [taskPlanData, setTaskPlanData] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskNotes, setTaskNotes] = useState("");
  const [taskPlan, setTaskPlan] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const params = useParams();
  const appAcronym = params.appAcronym;
  const [networkStatus, setNetworkStatus] = useState("pending");

  axios.defaults.withCredentials = true;

  useEffect(() => {
    const getData = async () => {
      try {
        const appData = await axios.get(
          `http://localhost:3001/api/app/${appAcronym}`
        );
        const appPlans = await axios.get(
          `http://localhost:3001/api/plans/${appAcronym}`
        );
        setAppRnum(appData.data[0].app_Rnumber);
        setTaskPlanData(appPlans.data);
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
    .post("http://localhost:3001/api/tasks/create", {
      taskId: `${appAcronym}_${appRnum}`,
      taskPlan: taskPlan,
      taskName: taskName,
      taskDescription: taskDescription,
      taskNotes: taskNotes,
      taskAppAcronym: appAcronym,
      taskCreator: auth.username,
      taskState: 'open'
    })
    .then((response) => {
      if (response.data.message === "New task created!") {
        alert(response.data.message);
        window.location.reload(true);
      } else {
        setErrMsg(response.data.message);
      }
    });
  };

  return (
    <>
      {networkStatus === "resolved" ? (
        <>
          {/* {console.log(appRnum)} */}
          <button
            className="btn btn-primary"
            data-toggle="modal"
            data-target="#addTask"
          >
            Create task
          </button>
          <div
            className="modal fade"
            id="addTask"
            tabIndex="-1"
            aria-labelledby="addTaskLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="addTaskLabel">
                    <b>Create New Task</b>
                  </h5>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmit}>
                    <div
                      className={errMsg ? "alert alert-info" : "offscreen"}
                      role="alert"
                    >
                      {errMsg}
                    </div>
                    <div className="form-group">
                      <label htmlFor="taskPlan">Plan:</label>
                      <select
                        className="form-control"
                        id="taskPlan"
                        required
                        onChange={(e) => {
                          setTaskPlan(e.target.value);
                        }}
                      >
                        <option value="">Choose plan!</option>
                        {taskPlanData.length > 0
                          ? taskPlanData.map((data) => {
                              return (
                                <option
                                  key={data.plan_MVP_name}
                                  value={data.plan_MVP_name}
                                >
                                  {data.plan_MVP_name}
                                </option>
                              );
                            })
                          : null}
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="taskName">Task Name:</label>
                      <input
                        className="form-control"
                        type="text"
                        id="taskName"
                        autoComplete="off"
                        required
                        onChange={(e) => setTaskName(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="taskDesc">Task Description:</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        id="taskDesc"
                        autoComplete="off"
                        required
                        onChange={(e) => setTaskDescription(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="taskNotes">Task Notes:</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        id="taskNotes"
                        autoComplete="off"
                        onChange={(e) => setTaskNotes(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary">
                      Create task
                    </button>
                  </form>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default CreateTask;
