import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import MultiSelect from "react-multiple-select-dropdown-lite";
import "react-multiple-select-dropdown-lite/dist/index.css";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import Unauthorized from "./Unauthorized";

const CreateApp = () => {
  const { auth } = useAuth();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [userTitleData, setUserTitleData] = useState([]);
  const [appAcronym, setAppAcronym] = useState("");
  const [appDesc, setAppDesc] = useState("");
  const [permitCreate, setPermitCreate] = useState("");
  const [permitOpen, setPermitOpen] = useState("");
  const [permitToDoList, setPermitToDoList] = useState("");
  const [permitDoing, setPermitDoing] = useState("");
  const [permitDone, setPermitDone] = useState("");

  const [errMsg, setErrMsg] = useState("");

  const [networkStatus, setNetworkStatus] = useState("pending");

  axios.defaults.withCredentials = true;

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/api/app/create", {
        appAcronym: appAcronym,
        appDesc: appDesc,
        appRnumber: 1,
        startDate: startDate,
        endDate: endDate,
        permitCreate: permitCreate,
        permitOpen: permitOpen,
        permitToDoList: permitToDoList,
        permitDoing: permitDoing,
        permitDone: permitDone,
      })
      .then((response) => {
        if (response.data.message === "New application project created!") {
          alert(response.data.message);
          window.location.reload(true);
        } else {
          setErrMsg(response.data.message);
        }
      });
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const allProjectRoles = await axios.get(
          "http://localhost:3001/api/user-titles"
        );
        setUserTitleData(allProjectRoles.data);
        setNetworkStatus("resolved");
      } catch (error) {
        console.log("error", error);
      }
    };
    getData();
  }, []);

  const titleOptions = [];
  userTitleData.map((data) => {
    const titleOption = {
      label: data.title,
      value: data.title,
    };
    titleOptions.push(titleOption);
  });

  const handlePermitCreate = (val) => {
    setPermitCreate(val);
  };

  const handlePermitOpen = (val) => {
    setPermitOpen(val);
  };

  const handlePermitToDo = (val) => {
    setPermitToDoList(val);
  };

  const handlePermitDoing = (val) => {
    setPermitDoing(val);
  };

  const handlePermitDone = (val) => {
    setPermitDone(val);
  };

  return (
    <>
      {networkStatus === "resolved" ? (
        auth.projectRoles.includes("Project Manager") ? (
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-xs-12 col-sm-6 col-sm-offset-4">
                  <div className="form-login">
                    <h2 className="text-center mt-4">
                      Create Application Project
                    </h2>
                    <form onSubmit={handleSubmit}>
                      <div
                        className={errMsg ? "alert alert-info" : "offscreen"}
                        role="alert"
                      >
                        {errMsg}
                      </div>
                      <div className="form-group">
                        <label htmlFor="appAcronym">App Acronym:</label>
                        <input
                          className="form-control"
                          type="text"
                          id="appAcronym"
                          autoComplete="off"
                          required
                          onChange={(e) => setAppAcronym(e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="appDesc">App Description:</label>
                        <textarea
                          className="form-control"
                          id="appDesc"
                          rows="3"
                          autoComplete="off"
                          required
                          onChange={(e) => setAppDesc(e.target.value)}
                        ></textarea>
                      </div>
                      <div className="row mb-3">
                        <div className="col">
                          <DatePicker
                            label="Start Date"
                            openTo="day"
                            views={["day", "month", "year"]}
                            value={startDate}
                            onChange={(newValue) => {
                              setStartDate(newValue.format("YYYY-MM-DD"));
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                helperText={params?.inputProps?.placeholder}
                              />
                            )}
                          />
                        </div>
                        <div className="col">
                          <DatePicker
                            label="End Date"
                            openTo="day"
                            views={["day", "month", "year"]}
                            value={endDate}
                            onChange={(newValue) => {
                              setEndDate(newValue.format("YYYY-MM-DD"));
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                helperText={params?.inputProps?.placeholder}
                              />
                            )}
                          />
                        </div>
                      </div>
                      <h5>
                        <b>Permissions:</b>
                      </h5>
                      <div className="form-group">
                        <label htmlFor="permitCreate">Create task:</label>
                        <MultiSelect
                          options={titleOptions}
                          onChange={handlePermitCreate}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="permitOpen">Update open task to To-Do-List:</label>
                        <MultiSelect
                          options={titleOptions}
                          onChange={handlePermitOpen}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="permitToDoList">Update task from To-Do to Doing:</label>
                        <MultiSelect
                          options={titleOptions}
                          onChange={handlePermitToDo}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="permitDoing">Update task from Doing to Done:</label>
                        <MultiSelect
                          options={titleOptions}
                          onChange={handlePermitDoing}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="permitDone">Update task from Done to Close:</label>
                        <MultiSelect
                          options={titleOptions}
                          onChange={handlePermitDone}
                        />
                      </div>
                      <button type="submit" className="btn btn-primary btn-block">
                        Submit
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </LocalizationProvider>
        ) : <Unauthorized />
      ) : null}
    </>
  );
};

export default CreateApp;
