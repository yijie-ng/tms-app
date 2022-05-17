import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import useAuth from "../hooks/useAuth";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const AppProjects = () => {
  const { auth } = useAuth();
  const [appData, setAppData] = useState([]);
  const [clickedApp, setClickedApp] = useState([]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [userTitleData, setUserTitleData] = useState([]);
  const [appDesc, setAppDesc] = useState("");
  const [permitCreate, setPermitCreate] = useState("");
  const [permitOpen, setPermitOpen] = useState("");
  const [permitToDoList, setPermitToDoList] = useState("");
  const [permitDoing, setPermitDoing] = useState("");
  const [permitDone, setPermitDone] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const [networkStatus, setNetworkStatus] = useState("pending");

  axios.defaults.withCredentials = true;

  useEffect(() => {
    const getData = async () => {
      try {
        const getAppData = await axios.get("http://localhost:3001/api/app");
        const allProjectRoles = await axios.get("http://localhost:3001/api/user-titles");
        setAppData(getAppData.data);
        setUserTitleData(allProjectRoles.data);
        setNetworkStatus("resolved");
      } catch (error) {
        console.log("error", error);
      }
    };
    getData();
  }, []);

  // MUI Dialog Modal
  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState("paper");

  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const descriptionElementRef = useRef(null);
  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);
  // End of MUI Dialog Modal

  const setData = (app) => {
    setOpen(true);
    let { app_acronym, app_description, app_startDate, app_endDate, app_permit_create, app_permit_open, app_permit_toDoList, app_permit_doing, app_permit_done } = app;
    setClickedApp(app);
    setStartDate(moment(app.app_startDate).format("YYYY-MM-DD"));
    setEndDate(moment(app.app_endDate).format("YYYY-MM-DD"));
    setAppDesc(app.app_description);
    setPermitCreate(app.app_permit_create);
    setPermitOpen(app.app_permit_open);
    setPermitToDoList(app.app_permit_toDoList);
    setPermitDoing(app.app_permit_doing);
    setPermitDone(app.app_permit_done);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const appAcronym = clickedApp.app_acronym;
    axios.put(`http://localhost:3001/api/app/${appAcronym}/update`, {
      appDesc: appDesc,
      startDate: startDate,
      endDate: endDate,
      permitCreate: permitCreate,
      permitOpen: permitOpen,
      permitToDoList: permitToDoList,
      permitDoing: permitDoing,
      permitDone: permitDone
    }).then((response) => {
      if (response.data.message === "App updated!") {
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
        <div className="container">
          <h1 className="mb-4">
            <b>All Application Projects</b>
          </h1>
          {auth.projectRoles.includes("Project Manager") ? (
            <Link to="/applications/create">
              <button className="btn btn-primary mb-3">Create App</button>
            </Link>
          ) : null}
          <div className="row row-cols-3">
            {appData.length > 0 ? (
              appData.map((app) => {
                return (
                  <>
                    <div className="col">
                      <Card key={app.app_acronym}>
                        <CardContent>
                          <Typography
                            sx={{ fontSize: 14 }}
                            color="text.secondary"
                            gutterBottom
                          >
                            APP RUNNING NO.: {app.app_Rnumber}
                          </Typography>
                          <Typography variant="h5" component="div">
                            {app.app_acronym}
                          </Typography>
                          <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            Start Date: {moment(app.app_startDate).format("LL")}
                          </Typography>
                          <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            End Date: {moment(app.app_endDate).format("LL")}
                          </Typography>
                          <Typography variant="body1">
                            {app.app_description}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Link to={`/applications/${app.app_acronym}/kanban`}>
                            <Button size="small">View Kanban</Button>
                          </Link>
                          {auth.projectRoles.includes("Project Manager") ? (
                            <Button
                              size="small"
                              color="error"
                              onClick={() => setData(app)}
                            >
                              Edit App
                            </Button>
                          ) : null}
                        </CardActions>
                      </Card>
                      <Dialog
                        open={open}
                        onClose={handleClose}
                        scroll={scroll}
                        aria-labelledby="scroll-dialog-title"
                        aria-describedby="scroll-dialog-description"
                      >
                        <DialogTitle id="scroll-dialog-title">
                          App Acronym: {clickedApp.app_acronym}
                        </DialogTitle>
                        <DialogContent dividers={scroll === "paper"}>
                          <DialogContentText
                            id="scroll-dialog-description"
                            ref={descriptionElementRef}
                            tabIndex={-1}
                          >
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                            <div>
                              <span><b>Edit App</b></span>
                              <br></br>
                              <form onSubmit={handleSubmit}>
                                <div
                                  className={errMsg ? "alert alert-info" : "offscreen"}
                                  role="alert"
                                >
                                  {errMsg}
                                </div>
                                <div className="form-group">
                                  <label htmlFor="appDesc">App Description:</label>
                                  <textarea
                                    className="form-control"
                                    id="appDesc"
                                    rows="3"
                                    autoComplete="off"
                                    value={appDesc}
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
                                <span>
                                  <b>Permissions:</b>
                                </span>
                                <div className="form-group">
                                  <label htmlFor="permitCreate">Create task:</label>
                                    <select
                                        className="form-control"
                                        id="permitCreate"
                                        value={permitCreate}
                                        onChange={(e) => {
                                          setPermitCreate(e.target.value);
                                        }}
                                    >
                                        <option value="">Choose user group!</option>
                                        {userTitleData.map((data) => {
                                              return (
                                                <option
                                                  key={data.title}
                                                  value={data.title}
                                                >
                                                  {data.title}
                                                </option>
                                              );
                                            })}
                                    </select>
                                </div>
                                <div className="form-group">
                                  <label htmlFor="permitOpen">Update open task to To-Do-List:</label>
                                    <select
                                        className="form-control"
                                        id="permitOpen"
                                        value={permitOpen}
                                        onChange={(e) => {
                                          setPermitOpen(e.target.value);
                                        }}
                                    >
                                        <option value="">Choose user group!</option>
                                        {userTitleData.map((data) => {
                                              return (
                                                <option
                                                  key={data.title}
                                                  value={data.title}
                                                >
                                                  {data.title}
                                                </option>
                                              );
                                            })}
                                    </select>
                                </div>
                                <div className="form-group">
                                  <label htmlFor="permitToDoList">Update task from To-Do to Doing:</label>
                                  <select
                                        className="form-control"
                                        id="permitToDoList"
                                        value={permitToDoList}
                                        onChange={(e) => {
                                          setPermitToDoList(e.target.value);
                                        }}
                                  >
                                        <option value="">Choose user group!</option>
                                        {userTitleData.map((data) => {
                                              return (
                                                <option
                                                  key={data.title}
                                                  value={data.title}
                                                >
                                                  {data.title}
                                                </option>
                                              );
                                            })}
                                  </select>
                                </div>
                                <div className="form-group">
                                  <label htmlFor="permitDoing">Update task from Doing to Done:</label>
                                  <select
                                        className="form-control"
                                        id="permitDoing"
                                        value={permitDoing}
                                        onChange={(e) => {
                                          setPermitDoing(e.target.value);
                                        }}
                                  >
                                        <option value="">Choose user group!</option>
                                        {userTitleData.map((data) => {
                                              return (
                                                <option
                                                  key={data.title}
                                                  value={data.title}
                                                >
                                                  {data.title}
                                                </option>
                                              );
                                            })}
                                  </select>
                                </div>
                                <div className="form-group">
                                  <label htmlFor="permitDone">Update task from Done to Close:</label>
                                  <select
                                        className="form-control"
                                        id="permitDone"
                                        value={permitDone}
                                        onChange={(e) => {
                                          setPermitDone(e.target.value);
                                        }}
                                  >
                                        <option value="">Choose user group!</option>
                                        {userTitleData.map((data) => {
                                              return (
                                                <option
                                                  key={data.title}
                                                  value={data.title}
                                                >
                                                  {data.title}
                                                </option>
                                              );
                                            })}
                                  </select>
                                </div>
                                <button type="submit" className="btn btn-primary">
                                  Submit
                                </button>
                              </form>
                            </div>
                            </LocalizationProvider>
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleClose}>Cancel</Button>
                        </DialogActions>
                      </Dialog>
                    </div>
                  </>
                );
              })
            ) : (
              <h5>No application projects!</h5>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default AppProjects;
