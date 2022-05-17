import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import useAuth from "../hooks/useAuth";
import Board from "react-trello";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

import CreateTask from "./CreateTask";
import CreatePlan from "./CreatePlan";
import UpdatePlan from "./UpdatePlan";

// import '../assets/Kanban.css';

const columns = [
  {
    id: "created_at",
    label: "Date & Time",
    minWidth: 120,
    format: (value) => moment(value).format("LLL"),
  },
  { id: "logon_user", label: "Logon User", minWidth: 110, align: "center" },
  {
    id: "task_state",
    label: "Task State",
    minWidth: 100,
    align: "center",
  },
  {
    id: "task_notes",
    label: "Task Notes",
    minWidth: 170,
    align: "left",
  },
];

const Kanban = () => {
  const { auth } = useAuth();
  const [allTasks, setAllTasks] = useState([]);
  const [openTasks, setOpenTasks] = useState([]);
  const [todoTasks, setTodoTasks] = useState([]);
  const [doingTasks, setDoingTasks] = useState([]);
  const [doneTasks, setDoneTasks] = useState([]);
  const [closedTasks, setClosedTasks] = useState([]);
  const [allTaskNotes, setAllTaskNotes] = useState([]);
  const [appPermissions, setAppPermissions] = useState([]);
  const [plans, setPlans] = useState([]);
  const [appData, setAppData] = useState([]);
  const [clickedCol, setClickedCol] = useState();
  const [clickedLaneId, setClickedLaneId] = useState();
  const [clickedTaskNotes, setClickedTaskNotes] = useState([]);
  const [addTaskNotes, setAddTaskNotes] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPlan, setTaskPlan] = useState("");
  const [refresh, setRefresh] = useState(false);

  const [clickedTaskDetails, setClickedTaskDetails] = useState([
    {
      task_name: "",
      task_description: "",
      task_id: "",
      task_plan: "",
      task_app_acronym: "",
      task_state: "",
      task_creator: "",
      task_owner: "",
    },
  ]);

  const [clickedPlanDetails, setClickedPlanDetails] = useState([
    {
      plan_MVP_name: "",
      plan_description: "",
      plan_startDate: "",
      plan_endDate: "",
      plan_app_acronym: "",
    },
  ]);

  // console.log(taskDescription);
  // console.log(taskPlan);

  const params = useParams();
  const appAcronym = params.appAcronym;

  const [errMsg, setErrMsg] = useState("");

  const [networkStatus, setNetworkStatus] = useState("pending");

  axios.defaults.withCredentials = true;

  useEffect(() => {
    const getData = async () => {
      try {
        const tasks = await axios.get(
          `http://localhost:3001/api/tasks/${appAcronym}`
        );
        const open = await axios.get(`http://localhost:3001/api/tasks/${appAcronym}/open`);
        const todo = await axios.get(`http://localhost:3001/api/tasks/${appAcronym}/todo`);
        const doing = await axios.get(`http://localhost:3001/api/tasks/${appAcronym}/doing`);
        const done = await axios.get(`http://localhost:3001/api/tasks/${appAcronym}/done`);
        const close = await axios.get(`http://localhost:3001/api/tasks/${appAcronym}/close`);
        const notes = await axios.get("http://localhost:3001/api/task-notes");
        const app = await axios.get(
          `http://localhost:3001/api/app/${appAcronym}`
        );
        const appPlans = await axios.get(
          `http://localhost:3001/api/plans/${appAcronym}`
        );
        const appPermit = await axios.get(
          `http://localhost:3001/api/tasks/permissions/${appAcronym}`
        );
        setAllTasks(tasks.data);
        setOpenTasks(open.data);
        setTodoTasks(todo.data);
        setDoingTasks(doing.data);
        setDoneTasks(done.data);
        setClosedTasks(close.data);
        setAllTaskNotes(notes.data);
        setPlans(appPlans.data);
        setAppData(app.data[0]);
        setAppPermissions(appPermit.data);
        // setTaskDescription(clickedTaskDetails.task_description);
        // setTaskPlan(clickedTaskDetails.task_plan);
        setNetworkStatus("resolved");
      } catch (error) {
        console.log("error", error);
      }
    };
    getData();
  }, [refresh]);

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

  // MUI Table
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  // End of MUI Table

  let openCards = [];

  if (openTasks.length > 0) {
    openTasks.map((openTask, index) => {
      let task = {
        id: openTask.task_id,
        laneId: "open",
        title: openTask.task_name,
        description: openTask.task_description,
        label: openTask.task_creator,
        metadata: openTask.task_id,
        // draggable: checkOpenPermit(),
      };
      openCards.push(task);
    });
  }

  let todoCards = [];

  if (todoTasks.length > 0) {
    todoTasks.map((todoTask, index) => {
      let task = {
        id: todoTask.task_id,
        laneId: "todo",
        title: todoTask.task_name,
        description: todoTask.task_description,
        label: todoTask.task_owner,
        metadata: todoTask.task_id,
      };
      todoCards.push(task);
    });
  }

  let doingCards = [];

  if (doingTasks.length > 0) {
    doingTasks.map((doingTask, index) => {
      let task = {
        id: doingTask.task_id,
        laneId: "doing",
        title: doingTask.task_name,
        description: doingTask.task_description,
        label: doingTask.task_owner,
        metadata: doingTask.task_id,
      };
      doingCards.push(task);
    });
  }

  let doneCards = [];

  if (doneTasks.length > 0) {
    doneTasks.map((doneTask, index) => {
      let task = {
        id: doneTask.task_id,
        laneId: "done",
        title: doneTask.task_name,
        description: doneTask.task_description,
        label: doneTask.task_owner,
        metadata: doneTask.task_id,
      };
      doneCards.push(task);
    });
  }

  let closeCards = [];

  if (closedTasks.length > 0) {
    closedTasks.map((closedTask, index) => {
      let task = {
        id: closedTask.task_id,
        laneId: "close",
        title: closedTask.task_name,
        description: closedTask.task_description,
        label: closedTask.task_owner,
        metadata: closedTask.task_id,
        draggable: false,
      };
      closeCards.push(task);
    });
  }

  let plansCards = [];

  if (plans.length > 0) {
    plans.map((plans, index) => {
      let plan = {
        id: index.toString(),
        laneId: "plans",
        title: plans.plan_MVP_name,
        description: `Start: ${moment(plans.plan_startDate).format(
          "LL"
        )} | End: ${moment(plans.plan_endDate).format("LL")}`,
        // body: plans.plan_description,
        label: plans.plan_app_acronym,
        metadata: {
          planName: plans.plan_MVP_name,
          planDesc: plans.plan_description,
        },
        draggable: false,
      };
      plansCards.push(plan);
    });
  }

  const data = {
    lanes: [
      {
        id: "plans",
        title: "Plans",
        cards: plansCards,
        style: { backgroundColor: "#6F6F6F", color: "#fff" },
        droppable: false,
      },
      {
        id: "open",
        title: "Open",
        cards: openCards,
        style: { backgroundColor: "#3179ba", color: "#fff" },
        droppable: true,
      },
      {
        id: "todo",
        title: "To-do",
        cards: todoCards,
        style: { backgroundColor: "#E41215", color: "#fff" },
      },
      {
        id: "doing",
        title: "Doing",
        cards: doingCards,
        style: { backgroundColor: "#FBF044" },
      },
      {
        id: "done",
        title: "Done",
        cards: doneCards,
        style: { backgroundColor: "#5CCB5F" },
      },
      {
        id: "close",
        title: "Close",
        cards: closeCards,
        style: { backgroundColor: "#6F6F6F", color: "#fff" },
      },
    ],
  };


  const handleDragEnd = async (
    cardId,
    sourceLaneId,
    targetLaneId,
    position,
    cardDetails
  ) => {
    const getPermit = async () => {
      let condition = true;
      const taskId = cardDetails.metadata;
      await axios
        .put(`http://localhost:3001/api/tasks/update-state/${taskId}`, {
          taskState: targetLaneId,
          taskName: cardDetails.title,
          logonUser: auth.username,
          appAcronym: appAcronym,
        })
        .then((response) => {
          if (response.data.message === "You do not have the permission!") {
            alert(response.data.message);
            condition = false;
          }
        });
      return condition;
    };

    const result = await getPermit();
    setRefresh(!refresh);
  };

  const handleCardClick = (cardId, metadata, laneId) => {
    setOpen(true);
    localStorage.setItem("Plan", metadata.planName);
    setClickedLaneId(laneId);

    // if (laneId === "plans") {
    //   setClickedCol("plans");
    // } else {
    //   setClickedCol("Not plans");
    // }

    if (laneId === "plans") {
      setClickedCol("plans");
    } else if (laneId === "open") {
      setClickedCol("open");
    } else if (laneId === "todo") {
      setClickedCol("todo");
    } else if (laneId === "doing") {
      setClickedCol("doing");
    } else if (laneId === "done") {
      setClickedCol("done");
    } else {
      setClickedCol("close");
    }

    if (allTasks.length > 0) {
      let selectedTask = allTasks.filter(function (element) {
        return element.task_id == cardId;
      });

      setClickedTaskDetails(selectedTask[0]);
    };

    if (plans.length > 0) {
      let selectedPlan = plans.filter(function (element) {
        return element.plan_MVP_name == metadata.planName;
      });
  
      setClickedPlanDetails(selectedPlan[0]);
    };

    if (allTaskNotes.length > 0) {
      let taskNotes = allTaskNotes.filter(function (element) {
        return element.task_id == cardId;
      });
  
      setClickedTaskNotes(taskNotes);
    };
  };

  const handleEdit = (e) => {
    e.preventDefault();
    const taskId = clickedTaskDetails.task_id;
    axios.put(`http://localhost:3001/api/tasks/update/${taskId}`, {
      taskState: clickedTaskDetails.task_state,
      logonUser: auth.username,
      taskName: clickedTaskDetails.task_name,  
      taskDescription: taskDescription,
      taskPlan: taskPlan,
      appAcronym: appAcronym
    }).then((response) => {
      if (response.data.message === "Task updated!") {
        alert(response.data.message);
        window.location.reload(true);
      } else {
        setErrMsg(response.data.message);
      };
    });
  };

  const handleAddNotes = (e) => {
    e.preventDefault();
    axios.post("http://localhost:3001/api/task-notes/create", {
      taskNotes: addTaskNotes,
      taskName: clickedTaskDetails.task_name,
      logonUser: auth.username,
      taskState: clickedTaskDetails.task_state,
      taskId: clickedTaskDetails.task_id
    }).then((response) => {
      if (response.data.message === "Task notes added!") {
        alert(response.data.message);
        window.location.reload(true);
      } else {
        setErrMsg(response.data.message);
      };
    });
  };

  // const MyCard = {
  //   body: { color: 'black', 'font-size': '14px' }
  // }

  return (
    <>
      {networkStatus === "resolved" ? (
        <>
          <div className="container">
            <div>
              <h1>
                <b>{appAcronym}</b>
              </h1>
              <Typography
                sx={{ fontSize: 18, fontFamily: "Nunito" }}
                color="text.secondary"
              >
                {appData.app_description}
              </Typography>
              <Typography sx={{ fontFamily: "Nunito" }} color="text.secondary">
                Start Date: {moment(appData.app_startDate).format("LL")}
              </Typography>
              <Typography
                sx={{ mb: 1.5, fontFamily: "Nunito" }}
                color="text.secondary"
              >
                End Date: {moment(appData.app_endDate).format("LL")}
              </Typography>
            </div>
            <div>
              {auth.projectRoles.includes(
                appPermissions[0].app_permit_create
              ) ? (
                <CreateTask />
              ) : null}
              {auth.projectRoles.includes("Project Manager") ? (
                <CreatePlan />
              ) : null}
              <Link to="/applications">
                <button className="btn btn-primary ml-3">Back to Apps</button>
              </Link>
            </div>
            <div>
              <Dialog
                open={open}
                onClose={handleClose}
                scroll={scroll}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
              >
                {(() => {
                  if (clickedCol === "plans") {
                    return (
                      <>
                        <DialogTitle id="scroll-dialog-title">
                          {clickedPlanDetails.plan_MVP_name}
                        </DialogTitle>
                        <DialogContent dividers={scroll === "paper"}>
                          <DialogContentText
                            id="scroll-dialog-description"
                            ref={descriptionElementRef}
                            tabIndex={-1}
                          >
                            {auth.projectRoles.includes("Project Manager") ? (
                              <UpdatePlan />
                            ) : (
                              <>
                                <span><b>Application:</b> {appAcronym}</span>
                                <br></br>
                                <span>
                                  <b>Plan Name:</b>{" "}
                                  {clickedPlanDetails.plan_MVP_name}
                                </span>
                                <br></br>
                                <span>
                                  <b>Plan Description:</b>{" "}
                                  {clickedPlanDetails.plan_description}
                                </span>
                                <br></br>
                                <span>
                                  <b>Start Date:</b>{" "}
                                  {moment(
                                    clickedPlanDetails.plan_startDate
                                  ).format("LL")}
                                </span>
                                <br></br>
                                <span>
                                  <b>End Date:</b>{" "}
                                  {moment(
                                    clickedPlanDetails.plan_endDate
                                  ).format("LL")}
                                </span>
                                <br></br>
                              </>
                            )}
                          </DialogContentText>
                        </DialogContent>
                      </>
                    );
                  } else if (clickedCol === "open") {
                    if (auth.projectRoles.includes(appPermissions[0].app_permit_open)) {
                      return (
                        <>
                          <DialogTitle id="scroll-dialog-title">
                            {clickedTaskDetails.task_id}: {clickedTaskDetails.task_name}
                          </DialogTitle>
                          <DialogContent dividers={scroll === "paper"}>
                            <DialogContentText
                              id="scroll-dialog-description"
                              ref={descriptionElementRef}
                              tabIndex={-1}
                            >
                              <span>
                                  <b>Task ID:</b> {clickedTaskDetails.task_id}
                                </span>
                                <br></br>
                                <span>
                                  <b>Task Name:</b> {clickedTaskDetails.task_name}
                                </span>
                                <br></br>
                                <span>
                                  <b>Task Description:</b>{" "}
                                  {clickedTaskDetails.task_description}
                                </span>
                                <br></br>
                                <span>
                                  <b>Plan:</b> {clickedTaskDetails.task_plan}
                                </span>
                                <br></br>
                                <span>
                                  <b>Task Creator:</b>{" "}
                                  {clickedTaskDetails.task_creator}
                                </span>
                                <br></br>
                                <span>
                                  <b>Task Owner:</b> {clickedTaskDetails.task_owner}
                                </span>
                                <br></br>
                                <form onSubmit={handleEdit} className="mt-2 mb-2">
                                  <div
                                    className={errMsg ? "alert alert-info" : "offscreen"}
                                    role="alert"
                                  >
                                    {errMsg}
                                  </div>
                                  <span>
                                    <b>Edit Task:</b>
                                  </span>
                                  <br></br>
                                  <div className="form-group">
                                    <label htmlFor="taskDesc">Task Description:</label>
                                    <textarea
                                      className="form-control"
                                      rows="3"
                                      id="taskDesc"
                                      autoComplete="off"
                                      onChange={(e) => setTaskDescription(e.target.value)}
                                    />
                                  </div>
                                  <div className="form-group">
                                    <label htmlFor="taskPlan">Plan:</label>
                                    <select
                                      className="form-control"
                                      id="taskPlan"
                                      onChange={(e) => {
                                        setTaskPlan(e.target.value);
                                      }}
                                    >
                                      <option value="">Choose plan!</option>
                                      {plans.length > 0
                                        ? plans.map((data) => {
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
                                  <button type="submit" className="btn btn-primary">
                                    Submit
                                  </button>
                                </form>
                                <span>
                                  <b>Task Notes:</b>
                                </span>
                                <br></br>
                                <Paper sx={{ width: "100%", overflow: "hidden" }}>
                                  <TableContainer sx={{ maxHeight: 440 }}>
                                    <Table stickyHeader aria-label="sticky table">
                                      <TableHead>
                                        <TableRow>
                                          {columns.map((column) => (
                                            <TableCell
                                              key={column.id}
                                              align="center"
                                              style={{
                                                minWidth: column.minWidth,
                                              }}
                                            >
                                              {column.label}
                                            </TableCell>
                                          ))}
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {clickedTaskNotes
                                          // .reverse()
                                          .slice(
                                            page * rowsPerPage,
                                            page * rowsPerPage + rowsPerPage
                                          )
                                          .map((row) => {
                                            return (
                                              <TableRow
                                                hover
                                                role="checkbox"
                                                tabIndex={-1}
                                                key={row.id}
                                              >
                                                {columns.map((column) => {
                                                  const value = row[column.id];
                                                  return (
                                                    <TableCell
                                                      key={column.id}
                                                      align={column.align}
                                                    >
                                                      {column.format &&
                                                      typeof value === "string"
                                                        ? column.format(value)
                                                        : value}
                                                    </TableCell>
                                                  );
                                                })}
                                              </TableRow>
                                            );
                                          }).reverse()}
                                      </TableBody>
                                    </Table>
                                  </TableContainer>
                                  <TablePagination
                                    rowsPerPageOptions={[10, 25, 100]}
                                    component="div"
                                    count={clickedTaskNotes.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                  />
                                </Paper>
                                <form onSubmit={handleAddNotes} className="mt-2">
                                  <div
                                    className={errMsg ? "alert alert-info" : "offscreen"}
                                    role="alert"
                                  >
                                    {errMsg}
                                  </div>
                                  <div className="form-group">
                                    <label htmlFor="taskNotes">Add Task Notes:</label>
                                    <textarea
                                      className="form-control"
                                      rows="3"
                                      id="taskNotes"
                                      autoComplete="off"
                                      onChange={(e) =>
                                        setAddTaskNotes(e.target.value)
                                      }
                                    />
                                  </div>
                                  <button type="submit" className="btn btn-primary">
                                    Submit
                                  </button>
                                </form>
                            </DialogContentText>
                          </DialogContent>
                        </>
                      )
                    } else {
                      return (
                        <>
                          <DialogTitle id="scroll-dialog-title">
                            {clickedTaskDetails.task_id}: {clickedTaskDetails.task_name}
                          </DialogTitle>
                          <DialogContent dividers={scroll === "paper"}>
                            <DialogContentText
                              id="scroll-dialog-description"
                              ref={descriptionElementRef}
                              tabIndex={-1}
                            >
                              <span>
                                  <b>Task ID:</b> {clickedTaskDetails.task_id}
                                </span>
                                <br></br>
                                <span>
                                  <b>Task Name:</b> {clickedTaskDetails.task_name}
                                </span>
                                <br></br>
                                <span>
                                  <b>Task Description:</b>{" "}
                                  {clickedTaskDetails.task_description}
                                </span>
                                <br></br>
                                <span>
                                  <b>Plan:</b> {clickedTaskDetails.task_plan}
                                </span>
                                <br></br>
                                <span>
                                  <b>Task Creator:</b>{" "}
                                  {clickedTaskDetails.task_creator}
                                </span>
                                <br></br>
                                <span>
                                  <b>Task Owner:</b> {clickedTaskDetails.task_owner}
                                </span>
                                <br></br>
                                <span>
                                  <b>Task Notes:</b>
                                </span>
                                <br></br>
                                <Paper sx={{ width: "100%", overflow: "hidden" }}>
                                  <TableContainer sx={{ maxHeight: 440 }}>
                                    <Table stickyHeader aria-label="sticky table">
                                      <TableHead>
                                        <TableRow>
                                          {columns.map((column) => (
                                            <TableCell
                                              key={column.id}
                                              align="center"
                                              style={{
                                                minWidth: column.minWidth,
                                              }}
                                            >
                                              {column.label}
                                            </TableCell>
                                          ))}
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {clickedTaskNotes
                                          // .reverse()
                                          .slice(
                                            page * rowsPerPage,
                                            page * rowsPerPage + rowsPerPage
                                          )
                                          .map((row) => {
                                            return (
                                              <TableRow
                                                hover
                                                role="checkbox"
                                                tabIndex={-1}
                                                key={row.id}
                                              >
                                                {columns.map((column) => {
                                                  const value = row[column.id];
                                                  return (
                                                    <TableCell
                                                      key={column.id}
                                                      align={column.align}
                                                    >
                                                      {column.format &&
                                                      typeof value === "string"
                                                        ? column.format(value)
                                                        : value}
                                                    </TableCell>
                                                  );
                                                })}
                                              </TableRow>
                                            );
                                          }).reverse()}
                                      </TableBody>
                                    </Table>
                                  </TableContainer>
                                  <TablePagination
                                    rowsPerPageOptions={[10, 25, 100]}
                                    component="div"
                                    count={clickedTaskNotes.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                  />
                                </Paper>
                            </DialogContentText>
                          </DialogContent>
                        </>
                      )
                    }
                  } else if (clickedCol === "todo") {
                    if (auth.projectRoles.includes(appPermissions[0].app_permit_toDoList)) {
                      return (
                        <>
                          <DialogTitle id="scroll-dialog-title">
                            {clickedTaskDetails.task_id}: {clickedTaskDetails.task_name}
                          </DialogTitle>
                          <DialogContent dividers={scroll === "paper"}>
                            <DialogContentText
                              id="scroll-dialog-description"
                              ref={descriptionElementRef}
                              tabIndex={-1}
                            >
                              <span>
                                  <b>Task ID:</b> {clickedTaskDetails.task_id}
                                </span>
                                <br></br>
                                <span>
                                  <b>Task Name:</b> {clickedTaskDetails.task_name}
                                </span>
                                <br></br>
                                <span>
                                  <b>Task Description:</b>{" "}
                                  {clickedTaskDetails.task_description}
                                </span>
                                <br></br>
                                <span>
                                  <b>Plan:</b> {clickedTaskDetails.task_plan}
                                </span>
                                <br></br>
                                <span>
                                  <b>Task Creator:</b>{" "}
                                  {clickedTaskDetails.task_creator}
                                </span>
                                <br></br>
                                <span>
                                  <b>Task Owner:</b> {clickedTaskDetails.task_owner}
                                </span>
                                <br></br>
                                <span>
                                  <b>Task Notes:</b>
                                </span>
                                <br></br>
                                <Paper sx={{ width: "100%", overflow: "hidden" }}>
                                  <TableContainer sx={{ maxHeight: 440 }}>
                                    <Table stickyHeader aria-label="sticky table">
                                      <TableHead>
                                        <TableRow>
                                          {columns.map((column) => (
                                            <TableCell
                                              key={column.id}
                                              align="center"
                                              style={{
                                                minWidth: column.minWidth,
                                              }}
                                            >
                                              {column.label}
                                            </TableCell>
                                          ))}
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {clickedTaskNotes
                                          // .reverse()
                                          .slice(
                                            page * rowsPerPage,
                                            page * rowsPerPage + rowsPerPage
                                          )
                                          .map((row) => {
                                            return (
                                              <TableRow
                                                hover
                                                role="checkbox"
                                                tabIndex={-1}
                                                key={row.id}
                                              >
                                                {columns.map((column) => {
                                                  const value = row[column.id];
                                                  return (
                                                    <TableCell
                                                      key={column.id}
                                                      align={column.align}
                                                    >
                                                      {column.format &&
                                                      typeof value === "string"
                                                        ? column.format(value)
                                                        : value}
                                                    </TableCell>
                                                  );
                                                })}
                                              </TableRow>
                                            );
                                          }).reverse()}
                                      </TableBody>
                                    </Table>
                                  </TableContainer>
                                  <TablePagination
                                    rowsPerPageOptions={[10, 25, 100]}
                                    component="div"
                                    count={clickedTaskNotes.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                  />
                                </Paper>
                                <form onSubmit={handleAddNotes} className="mt-2">
                                  <div
                                    className={errMsg ? "alert alert-info" : "offscreen"}
                                    role="alert"
                                  >
                                    {errMsg}
                                  </div>
                                      <span>
                                        <b>Add Task Notes:</b>
                                      </span>
                                      <div className="form-group">
                                        <textarea
                                          className="form-control"
                                          rows="3"
                                          id="taskNotes"
                                          autoComplete="off"
                                          onChange={(e) =>
                                            setAddTaskNotes(e.target.value)
                                          }
                                        />
                                      </div>
                                      <button type="submit" className="btn btn-primary">
                                        Submit
                                      </button>
                                </form>
                            </DialogContentText>
                          </DialogContent>
                        </>
                      )
                    } else {
                      return (
                        <>
                          <DialogTitle id="scroll-dialog-title">
                            {clickedTaskDetails.task_id}: {clickedTaskDetails.task_name}
                          </DialogTitle>
                          <DialogContent dividers={scroll === "paper"}>
                            <DialogContentText
                              id="scroll-dialog-description"
                              ref={descriptionElementRef}
                              tabIndex={-1}
                            >
                              <span>
                                  <b>Task ID:</b> {clickedTaskDetails.task_id}
                                </span>
                                <br></br>
                                <span>
                                  <b>Task Name:</b> {clickedTaskDetails.task_name}
                                </span>
                                <br></br>
                                <span>
                                  <b>Task Description:</b>{" "}
                                  {clickedTaskDetails.task_description}
                                </span>
                                <br></br>
                                <span>
                                  <b>Plan:</b> {clickedTaskDetails.task_plan}
                                </span>
                                <br></br>
                                <span>
                                  <b>Task Creator:</b>{" "}
                                  {clickedTaskDetails.task_creator}
                                </span>
                                <br></br>
                                <span>
                                  <b>Task Owner:</b> {clickedTaskDetails.task_owner}
                                </span>
                                <br></br>
                                <span>
                                  <b>Task Notes:</b>
                                </span>
                                <br></br>
                                <Paper sx={{ width: "100%", overflow: "hidden" }}>
                                  <TableContainer sx={{ maxHeight: 440 }}>
                                    <Table stickyHeader aria-label="sticky table">
                                      <TableHead>
                                        <TableRow>
                                          {columns.map((column) => (
                                            <TableCell
                                              key={column.id}
                                              align="center"
                                              style={{
                                                minWidth: column.minWidth,
                                              }}
                                            >
                                              {column.label}
                                            </TableCell>
                                          ))}
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {clickedTaskNotes
                                          // .reverse()
                                          .slice(
                                            page * rowsPerPage,
                                            page * rowsPerPage + rowsPerPage
                                          )
                                          .map((row) => {
                                            return (
                                              <TableRow
                                                hover
                                                role="checkbox"
                                                tabIndex={-1}
                                                key={row.id}
                                              >
                                                {columns.map((column) => {
                                                  const value = row[column.id];
                                                  return (
                                                    <TableCell
                                                      key={column.id}
                                                      align={column.align}
                                                    >
                                                      {column.format &&
                                                      typeof value === "string"
                                                        ? column.format(value)
                                                        : value}
                                                    </TableCell>
                                                  );
                                                })}
                                              </TableRow>
                                            );
                                          }).reverse()}
                                      </TableBody>
                                    </Table>
                                  </TableContainer>
                                  <TablePagination
                                    rowsPerPageOptions={[10, 25, 100]}
                                    component="div"
                                    count={clickedTaskNotes.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                  />
                                </Paper>
                            </DialogContentText>
                          </DialogContent>
                        </>
                      )
                    }
                  } else if (clickedCol === "doing") {
                    if (auth.projectRoles.includes(appPermissions[0].app_permit_doing)) {
                      return (
                        <>
                          <DialogTitle id="scroll-dialog-title">
                            {clickedTaskDetails.task_id}: {clickedTaskDetails.task_name}
                          </DialogTitle>
                          <DialogContent dividers={scroll === "paper"}>
                            <DialogContentText
                              id="scroll-dialog-description"
                              ref={descriptionElementRef}
                              tabIndex={-1}
                            >
                              <span>
                                  <b>Task ID:</b> {clickedTaskDetails.task_id}
                                </span>
                                <br></br>
                                <span>
                                  <b>Task Name:</b> {clickedTaskDetails.task_name}
                                </span>
                                <br></br>
                                <span>
                                  <b>Task Description:</b>{" "}
                                  {clickedTaskDetails.task_description}
                                </span>
                                <br></br>
                                <span>
                                  <b>Plan:</b> {clickedTaskDetails.task_plan}
                                </span>
                                <br></br>
                                <span>
                                  <b>Task Creator:</b>{" "}
                                  {clickedTaskDetails.task_creator}
                                </span>
                                <br></br>
                                <span>
                                  <b>Task Owner:</b> {clickedTaskDetails.task_owner}
                                </span>
                                <br></br>
                                <span>
                                  <b>Task Notes:</b>
                                </span>
                                <br></br>
                                <Paper sx={{ width: "100%", overflow: "hidden" }}>
                                  <TableContainer sx={{ maxHeight: 440 }}>
                                    <Table stickyHeader aria-label="sticky table">
                                      <TableHead>
                                        <TableRow>
                                          {columns.map((column) => (
                                            <TableCell
                                              key={column.id}
                                              align="center"
                                              style={{
                                                minWidth: column.minWidth,
                                              }}
                                            >
                                              {column.label}
                                            </TableCell>
                                          ))}
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {clickedTaskNotes
                                          // .reverse()
                                          .slice(
                                            page * rowsPerPage,
                                            page * rowsPerPage + rowsPerPage
                                          )
                                          .map((row) => {
                                            return (
                                              <TableRow
                                                hover
                                                role="checkbox"
                                                tabIndex={-1}
                                                key={row.id}
                                              >
                                                {columns.map((column) => {
                                                  const value = row[column.id];
                                                  return (
                                                    <TableCell
                                                      key={column.id}
                                                      align={column.align}
                                                    >
                                                      {column.format &&
                                                      typeof value === "string"
                                                        ? column.format(value)
                                                        : value}
                                                    </TableCell>
                                                  );
                                                })}
                                              </TableRow>
                                            );
                                          }).reverse()}
                                      </TableBody>
                                    </Table>
                                  </TableContainer>
                                  <TablePagination
                                    rowsPerPageOptions={[10, 25, 100]}
                                    component="div"
                                    count={clickedTaskNotes.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                  />
                                </Paper>
                                <form onSubmit={handleAddNotes} className="mt-2">
                                  <div
                                    className={errMsg ? "alert alert-info" : "offscreen"}
                                    role="alert"
                                  >
                                    {errMsg}
                                  </div>
                                      <span>
                                        <b>Add Task Notes:</b>
                                      </span>
                                      <div className="form-group">
                                        <textarea
                                          className="form-control"
                                          rows="3"
                                          id="taskNotes"
                                          autoComplete="off"
                                          onChange={(e) =>
                                            setAddTaskNotes(e.target.value)
                                          }
                                        />
                                      </div>
                                      <button type="submit" className="btn btn-primary">
                                        Submit
                                      </button>
                                </form>
                            </DialogContentText>
                          </DialogContent>
                        </>
                      )
                    } else {
                      return (
                        <>
                          <DialogTitle id="scroll-dialog-title">
                            {clickedTaskDetails.task_id}: {clickedTaskDetails.task_name}
                          </DialogTitle>
                          <DialogContent dividers={scroll === "paper"}>
                            <DialogContentText
                              id="scroll-dialog-description"
                              ref={descriptionElementRef}
                              tabIndex={-1}
                            >
                              <span>
                                  <b>Task ID:</b> {clickedTaskDetails.task_id}
                                </span>
                                <br></br>
                                <span>
                                  <b>Task Name:</b> {clickedTaskDetails.task_name}
                                </span>
                                <br></br>
                                <span>
                                  <b>Task Description:</b>{" "}
                                  {clickedTaskDetails.task_description}
                                </span>
                                <br></br>
                                <span>
                                  <b>Plan:</b> {clickedTaskDetails.task_plan}
                                </span>
                                <br></br>
                                <span>
                                  <b>Task Creator:</b>{" "}
                                  {clickedTaskDetails.task_creator}
                                </span>
                                <br></br>
                                <span>
                                  <b>Task Owner:</b> {clickedTaskDetails.task_owner}
                                </span>
                                <br></br>
                                <span>
                                  <b>Task Notes:</b>
                                </span>
                                <br></br>
                                <Paper sx={{ width: "100%", overflow: "hidden" }}>
                                  <TableContainer sx={{ maxHeight: 440 }}>
                                    <Table stickyHeader aria-label="sticky table">
                                      <TableHead>
                                        <TableRow>
                                          {columns.map((column) => (
                                            <TableCell
                                              key={column.id}
                                              align="center"
                                              style={{
                                                minWidth: column.minWidth,
                                              }}
                                            >
                                              {column.label}
                                            </TableCell>
                                          ))}
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {clickedTaskNotes
                                          // .reverse()
                                          .slice(
                                            page * rowsPerPage,
                                            page * rowsPerPage + rowsPerPage
                                          )
                                          .map((row) => {
                                            return (
                                              <TableRow
                                                hover
                                                role="checkbox"
                                                tabIndex={-1}
                                                key={row.id}
                                              >
                                                {columns.map((column) => {
                                                  const value = row[column.id];
                                                  return (
                                                    <TableCell
                                                      key={column.id}
                                                      align={column.align}
                                                    >
                                                      {column.format &&
                                                      typeof value === "string"
                                                        ? column.format(value)
                                                        : value}
                                                    </TableCell>
                                                  );
                                                })}
                                              </TableRow>
                                            );
                                          }).reverse()}
                                      </TableBody>
                                    </Table>
                                  </TableContainer>
                                  <TablePagination
                                    rowsPerPageOptions={[10, 25, 100]}
                                    component="div"
                                    count={clickedTaskNotes.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                  />
                                </Paper>
                            </DialogContentText>
                          </DialogContent>
                        </>
                      )
                    }
                  } else if (clickedCol === "done") {
                    if (auth.projectRoles.includes(appPermissions[0].app_permit_done)) {
                      return (
                        <>
                          <DialogTitle id="scroll-dialog-title">
                            {clickedTaskDetails.task_id}: {clickedTaskDetails.task_name}
                          </DialogTitle>
                          <DialogContent dividers={scroll === "paper"}>
                            <DialogContentText
                              id="scroll-dialog-description"
                              ref={descriptionElementRef}
                              tabIndex={-1}
                            >
                              <span>
                                  <b>Task ID:</b> {clickedTaskDetails.task_id}
                                </span>
                                <br></br>
                                <span>
                                  <b>Task Name:</b> {clickedTaskDetails.task_name}
                                </span>
                                <br></br>
                                <span>
                                  <b>Task Description:</b>{" "}
                                  {clickedTaskDetails.task_description}
                                </span>
                                <br></br>
                                <span>
                                  <b>Plan:</b> {clickedTaskDetails.task_plan}
                                </span>
                                <br></br>
                                <span>
                                  <b>Task Creator:</b>{" "}
                                  {clickedTaskDetails.task_creator}
                                </span>
                                <br></br>
                                <span>
                                  <b>Task Owner:</b> {clickedTaskDetails.task_owner}
                                </span>
                                <br></br>
                                <span>
                                  <b>Task Notes:</b>
                                </span>
                                <br></br>
                                <Paper sx={{ width: "100%", overflow: "hidden" }}>
                                  <TableContainer sx={{ maxHeight: 440 }}>
                                    <Table stickyHeader aria-label="sticky table">
                                      <TableHead>
                                        <TableRow>
                                          {columns.map((column) => (
                                            <TableCell
                                              key={column.id}
                                              align="center"
                                              style={{
                                                minWidth: column.minWidth,
                                              }}
                                            >
                                              {column.label}
                                            </TableCell>
                                          ))}
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {clickedTaskNotes
                                          // .reverse()
                                          .slice(
                                            page * rowsPerPage,
                                            page * rowsPerPage + rowsPerPage
                                          )
                                          .map((row) => {
                                            return (
                                              <TableRow
                                                hover
                                                role="checkbox"
                                                tabIndex={-1}
                                                key={row.id}
                                              >
                                                {columns.map((column) => {
                                                  const value = row[column.id];
                                                  return (
                                                    <TableCell
                                                      key={column.id}
                                                      align={column.align}
                                                    >
                                                      {column.format &&
                                                      typeof value === "string"
                                                        ? column.format(value)
                                                        : value}
                                                    </TableCell>
                                                  );
                                                })}
                                              </TableRow>
                                            );
                                          }).reverse()}
                                      </TableBody>
                                    </Table>
                                  </TableContainer>
                                  <TablePagination
                                    rowsPerPageOptions={[10, 25, 100]}
                                    component="div"
                                    count={clickedTaskNotes.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                  />
                                </Paper>
                                <form onSubmit={handleAddNotes} className="mt-2">
                                  <div
                                    className={errMsg ? "alert alert-info" : "offscreen"}
                                    role="alert"
                                  >
                                    {errMsg}
                                  </div>
                                      <span>
                                        <b>Add Task Notes:</b>
                                      </span>
                                      <div className="form-group">
                                        <textarea
                                          className="form-control"
                                          rows="3"
                                          id="taskNotes"
                                          autoComplete="off"
                                          onChange={(e) =>
                                            setAddTaskNotes(e.target.value)
                                          }
                                        />
                                      </div>
                                      <button type="submit" className="btn btn-primary">
                                        Submit
                                      </button>
                                </form>
                            </DialogContentText>
                          </DialogContent>
                        </>
                      )
                    } else {
                      return (
                        <>
                          <DialogTitle id="scroll-dialog-title">
                            {clickedTaskDetails.task_id}: {clickedTaskDetails.task_name}
                          </DialogTitle>
                          <DialogContent dividers={scroll === "paper"}>
                            <DialogContentText
                              id="scroll-dialog-description"
                              ref={descriptionElementRef}
                              tabIndex={-1}
                            >
                              <span>
                                  <b>Task ID:</b> {clickedTaskDetails.task_id}
                                </span>
                                <br></br>
                                <span>
                                  <b>Task Name:</b> {clickedTaskDetails.task_name}
                                </span>
                                <br></br>
                                <span>
                                  <b>Task Description:</b>{" "}
                                  {clickedTaskDetails.task_description}
                                </span>
                                <br></br>
                                <span>
                                  <b>Plan:</b> {clickedTaskDetails.task_plan}
                                </span>
                                <br></br>
                                <span>
                                  <b>Task Creator:</b>{" "}
                                  {clickedTaskDetails.task_creator}
                                </span>
                                <br></br>
                                <span>
                                  <b>Task Owner:</b> {clickedTaskDetails.task_owner}
                                </span>
                                <br></br>
                                <span>
                                  <b>Task Notes:</b>
                                </span>
                                <br></br>
                                <Paper sx={{ width: "100%", overflow: "hidden" }}>
                                  <TableContainer sx={{ maxHeight: 440 }}>
                                    <Table stickyHeader aria-label="sticky table">
                                      <TableHead>
                                        <TableRow>
                                          {columns.map((column) => (
                                            <TableCell
                                              key={column.id}
                                              align="center"
                                              style={{
                                                minWidth: column.minWidth,
                                              }}
                                            >
                                              {column.label}
                                            </TableCell>
                                          ))}
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {clickedTaskNotes
                                          // .reverse()
                                          .slice(
                                            page * rowsPerPage,
                                            page * rowsPerPage + rowsPerPage
                                          )
                                          .map((row) => {
                                            return (
                                              <TableRow
                                                hover
                                                role="checkbox"
                                                tabIndex={-1}
                                                key={row.id}
                                              >
                                                {columns.map((column) => {
                                                  const value = row[column.id];
                                                  return (
                                                    <TableCell
                                                      key={column.id}
                                                      align={column.align}
                                                    >
                                                      {column.format &&
                                                      typeof value === "string"
                                                        ? column.format(value)
                                                        : value}
                                                    </TableCell>
                                                  );
                                                })}
                                              </TableRow>
                                            );
                                          }).reverse()}
                                      </TableBody>
                                    </Table>
                                  </TableContainer>
                                  <TablePagination
                                    rowsPerPageOptions={[10, 25, 100]}
                                    component="div"
                                    count={clickedTaskNotes.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                  />
                                </Paper>
                            </DialogContentText>
                          </DialogContent>
                        </>
                      )
                    }
                  } else {
                    return (
                      <>
                        <DialogTitle id="scroll-dialog-title">
                            {clickedTaskDetails.task_id}: {clickedTaskDetails.task_name}
                          </DialogTitle>
                          <DialogContent dividers={scroll === "paper"}>
                            <DialogContentText
                              id="scroll-dialog-description"
                              ref={descriptionElementRef}
                              tabIndex={-1}
                            >
                              <span>
                                  <b>Task ID:</b> {clickedTaskDetails.task_id}
                                </span>
                                <br></br>
                                <span>
                                  <b>Task Name:</b> {clickedTaskDetails.task_name}
                                </span>
                                <br></br>
                                <span>
                                  <b>Task Description:</b>{" "}
                                  {clickedTaskDetails.task_description}
                                </span>
                                <br></br>
                                <span>
                                  <b>Plan:</b> {clickedTaskDetails.task_plan}
                                </span>
                                <br></br>
                                <span>
                                  <b>Task Creator:</b>{" "}
                                  {clickedTaskDetails.task_creator}
                                </span>
                                <br></br>
                                <span>
                                  <b>Task Owner:</b> {clickedTaskDetails.task_owner}
                                </span>
                                <br></br>
                                <span>
                                  <b>Task Notes:</b>
                                </span>
                                <br></br>
                                <Paper sx={{ width: "100%", overflow: "hidden" }}>
                                  <TableContainer sx={{ maxHeight: 440 }}>
                                    <Table stickyHeader aria-label="sticky table">
                                      <TableHead>
                                        <TableRow>
                                          {columns.map((column) => (
                                            <TableCell
                                              key={column.id}
                                              align="center"
                                              style={{
                                                minWidth: column.minWidth,
                                              }}
                                            >
                                              {column.label}
                                            </TableCell>
                                          ))}
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {clickedTaskNotes
                                          // .reverse()
                                          .slice(
                                            page * rowsPerPage,
                                            page * rowsPerPage + rowsPerPage
                                          )
                                          .map((row) => {
                                            return (
                                              <TableRow
                                                hover
                                                role="checkbox"
                                                tabIndex={-1}
                                                key={row.id}
                                              >
                                                {columns.map((column) => {
                                                  const value = row[column.id];
                                                  return (
                                                    <TableCell
                                                      key={column.id}
                                                      align={column.align}
                                                    >
                                                      {column.format &&
                                                      typeof value === "string"
                                                        ? column.format(value)
                                                        : value}
                                                    </TableCell>
                                                  );
                                                })}
                                              </TableRow>
                                            );
                                          }).reverse()}
                                      </TableBody>
                                    </Table>
                                  </TableContainer>
                                  <TablePagination
                                    rowsPerPageOptions={[10, 25, 100]}
                                    component="div"
                                    count={clickedTaskNotes.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                  />
                                </Paper>
                            </DialogContentText>
                          </DialogContent>
                      </>
                    )
                  }
                })()}
                <DialogActions>
                  <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
              </Dialog>
            </div>
          </div>
          <div className="mt-4">
            <Board
              style={{ backgroundColor: "#eee", display: "flex", justifyContent: "center" }}
              data={data}
              hideCardDeleteIcon
              handleDragEnd={handleDragEnd}
              onCardClick={handleCardClick}
              // components={{ Card: MyCard }}
            />
          </div>
        </>
      ) : null}
    </>
  );
};

export default Kanban;
