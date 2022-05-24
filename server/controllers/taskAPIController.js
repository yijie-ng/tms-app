const db = require("../database");
const { checkGroup } = require("./userTitlesController");
const { getTaskPermissions } = require("./taskController");
const { getApp } = require("./appController");

// POST /api/v1/task/new
// 1. authenticate user
// 2. check user group permission
// 3. Check if app exists
// 4. If app plan provided, check if app plan exists
// 5. If app plan doesnt exist, cannot create task
// 6. If no app plan provided, save plan as null
// 4. if user authenticated and authorized (task_creator is user), and if app and plan exists, create task
const createTask = async (req, res) => {
  const { taskName, taskDescription, taskNotes, taskPlan, taskAppAcronym } =
    req.body;
  const username = req.user.username;
  if (taskAppAcronym === "" || taskAppAcronym == null) {
    res.json({ message: "Please provide an App acronym!" });
  } else {
    getApp(taskAppAcronym).then((data) => {
      if (data.length > 0) {
        const appRnum = data[0].app_Rnumber;
        getTaskPermissions(taskAppAcronym).then((permissions) => {
          checkGroup(username, permissions[0].app_permit_create).then(
            (data) => {
              if (!data) {
                res.status(401).json({
                  message: "You're not authorized to do this action!",
                });
              } else {
                if (taskName === "" || taskName == null) {
                  res
                    .status(400)
                    .json({ message: "Please provide a task name!" });
                } else {
                  if (taskDescription === "" || taskDescription == null) {
                    res
                      .status(400)
                      .json({ message: "Please provide a task description!" });
                  } else {
                    if (taskPlan == null || taskPlan == "") {
                      db.query(
                        "INSERT INTO task (task_name, task_description, task_id, task_plan, task_app_acronym, task_creator) VALUES (?,?,?,?,?,?)",
                        [
                          taskName,
                          taskDescription,
                          `${taskAppAcronym}_${appRnum}`,
                          null,
                          taskAppAcronym,
                          username,
                        ],
                        (err, result) => {
                          if (err) {
                            res.status(400).json({ err: err });
                          } else {
                            if (result) {
                              if (taskNotes !== "") {
                                db.query(
                                  "INSERT INTO tasks_notes (task_notes, task_name, task_id, logon_user, task_state) VALUES (?,?,?,?,?)",
                                  [
                                    `${username} created task: '${taskName}' for plan: '${taskPlan}', with description: '${taskDescription}' and added notes: '${taskNotes}'.`,
                                    taskName,
                                    `${taskAppAcronym}_${appRnum}`,
                                    username,
                                    "open",
                                  ],
                                  (err, result) => {
                                    if (err) {
                                      res.status(400).json({ err: err });
                                    } else {
                                      if (result) {
                                        res.status(201).json({
                                          message: "New task created!",
                                        });
                                      } 
                                    }
                                  }
                                );
                              } else {
                                db.query(
                                  "INSERT INTO tasks_notes (task_notes, task_name, task_id, logon_user, task_state) VALUES (?,?,?,?,?)",
                                  [
                                    `${username} created task: ${taskName} for plan: '${taskPlan}', with description: '${taskDescription}'.`,
                                    taskName,
                                    `${taskAppAcronym}_${appRnum}`,
                                    username,
                                    "open",
                                  ],
                                  (err, result) => {
                                    if (err) {
                                      res.status(400).json({ err: err });
                                    } else {
                                      if (result) {
                                        res.status(201).json({
                                          message: "New task created!",
                                        });
                                      } 
                                    }
                                  }
                                );
                              }
                              db.query(
                                "SELECT * FROM application WHERE app_acronym = ?",
                                taskAppAcronym,
                                (err, result) => {
                                  if (result) {
                                    const appRnumber =
                                      result[0].app_Rnumber + 1;
                                    db.query(
                                      "UPDATE application SET app_Rnumber = ? WHERE app_acronym = ?",
                                      [appRnumber, taskAppAcronym]
                                    );
                                  }
                                }
                              );
                            } 
                          }
                        }
                      );
                    } else {
                      db.query(
                        "SELECT * FROM plan WHERE plan_MVP_name = ? AND plan_app_acronym = ?",
                        [taskPlan, taskAppAcronym],
                        (err, result) => {
                          if (err) {
                            res.status(400).json({ err: err });
                          } else {
                            if (result.length > 0) {
                              db.query(
                                "INSERT INTO task (task_name, task_description, task_id, task_plan, task_app_acronym, task_creator) VALUES (?,?,?,?,?,?)",
                                [
                                  taskName,
                                  taskDescription,
                                  `${taskAppAcronym}_${appRnum}`,
                                  taskPlan,
                                  taskAppAcronym,
                                  username,
                                ],
                                (err, result) => {
                                  if (err) {
                                    res.status(400).json({ err: err });
                                  } else {
                                    if (result) {
                                      if (taskNotes !== "") {
                                        db.query(
                                          "INSERT INTO tasks_notes (task_notes, task_name, task_id, logon_user, task_state) VALUES (?,?,?,?,?)",
                                          [
                                            `${username} created task: '${taskName}' for plan: '${taskPlan}', with description: '${taskDescription}' and added notes: '${taskNotes}'.`,
                                            taskName,
                                            `${taskAppAcronym}_${appRnum}`,
                                            username,
                                            "open",
                                          ],
                                          (err, result) => {
                                            if (err) {
                                              res
                                                .status(400)
                                                .json({ err: err });
                                            } else {
                                              if (result) {
                                                res.status(201).json({
                                                  message: "New task created!",
                                                });
                                              } 
                                            }
                                          }
                                        );
                                      } else {
                                        db.query(
                                          "INSERT INTO tasks_notes (task_notes, task_name, task_id, logon_user, task_state) VALUES (?,?,?,?,?)",
                                          [
                                            `${username} created task: ${taskName} for plan: '${taskPlan}', with description: '${taskDescription}'.`,
                                            taskName,
                                            `${taskAppAcronym}_${appRnum}`,
                                            username,
                                            "open",
                                          ],
                                          (err, result) => {
                                            if (err) {
                                              res
                                                .status(400)
                                                .json({ err: err });
                                            } else {
                                              if (result) {
                                                res.status(201).json({
                                                  message: "New task created!",
                                                });
                                              } 
                                            }
                                          }
                                        );
                                      }
                                      db.query(
                                        "SELECT * FROM application WHERE app_acronym = ?",
                                        taskAppAcronym,
                                        (err, result) => {
                                          if (result) {
                                            const appRnumber =
                                              result[0].app_Rnumber + 1;
                                            db.query(
                                              "UPDATE application SET app_Rnumber = ? WHERE app_acronym = ?",
                                              [appRnumber, taskAppAcronym]
                                            );
                                          }
                                        }
                                      );
                                    }
                                  }
                                }
                              );
                            } else {
                              res
                                .status(400)
                                .json({ message: "App plan does not exist!" });
                            }
                          }
                        }
                      );
                    }
                  }
                }
              }
            }
          );
        });
      } else {
        res.status(400).json({ message: "App does not exist!" });
      }
    });
  }
};

// GET /api/v1/tasks?taskState=?&appAcronym=? - Retrieve task in a particular state ('open', 'todo', 'doing', 'done', 'close')
const getTasksByState = async (req, res) => {
  const { taskState, appAcronym } = req.query; 
  if (taskState === "" || appAcronym === "") {
      res.status(400).json({ message: "Please provide task state and app acronym!" });
  } else {
    const app = await getApp(appAcronym);
    if (app.length > 0) {
      if (taskState === "open" || taskState === "todo" || taskState === "doing" || taskState === "done" || taskState === "close") {
        db.query(
          "SELECT * FROM task WHERE task_app_acronym = ? AND task_state = ?",
          [appAcronym, taskState],
          (err, result) => {
            if (err) {
              res.status(400).json({ err: err });
            } else {
              if (result.length > 0) {
                res.status(200).json(result);
              } else {
                res.status(200).json({
                  message: `No ${taskState} tasks found for ${appAcronym}!`,
                });
              }
            }
          }
        );
      } else {
        res.status(400).json({
          message:
            "Please provide a task state: 'open', 'todo', 'doing', 'done' or 'close'!",
        });
      }
    } else {
      res.status(400).json({ message: "App does not exist!" });
    }
  }
};

// PUT /api/v1/task/:taskId - approve 'doing to done'
// 1. Check permission to approve task to done, if true,
// 2. Check state of task, if 'doing' then update to 'done'
const approveDone = async (req, res) => {
  const taskId = req.params.taskId;
  const username = req.user.username;
  db.query("SELECT * FROM task WHERE task_Id = ?", taskId, (err, result) => {
    if (err) {
      res.status(400).json({ err: err });
    } else {
      if (result.length > 0) {
        const appAcronym = taskId.split("_")[0];
        const taskState = result[0].task_state;
        const taskName = result[0].task_name;
        getTaskPermissions(appAcronym).then((permissions) => {
          checkGroup(username, permissions[0].app_permit_doing).then((data) => {
            if (data) {
              if (taskState === "doing") {
                db.query(
                  "UPDATE task SET task_state = ?, task_owner = ? WHERE task_id = ?",
                  ["done", username, taskId],
                  (err, result) => {
                    if (err) {
                      res.status(400).json({ err: err });
                    } else {
                      if (result) {
                        db.query(
                          "INSERT INTO tasks_notes (task_notes, task_name, logon_user, task_state, task_id) VALUES (?,?,?,?,?)",
                          [
                            `${username} updated task to 'done'`,
                            taskName,
                            username,
                            "done",
                            taskId,
                          ],
                          (err, result) => {
                            if (err) {
                              res.status(400).json({ err: err });
                            } else {
                              if (result) {
                                res
                                  .status(201)
                                  .json({ message: "Task updated to 'done'!" });
                              } else {
                                res.status(400).json({
                                  message:
                                    "Failed to update to task 'done' to task notes!",
                                });
                              }
                            }
                          }
                        );
                      } else {
                        res.json({
                          message: "Failed to update task to 'done'!",
                        });
                      }
                    }
                  }
                );
              } else {
                res.status(403).json({ message: "Task not in 'doing' state!" });
              }
            } else {
              res
                .status(401)
                .json({ message: "You're not authorized to do this action!" });
            }
          });
        });
      } else {
        res.status(400).json({ message: "Invalid task ID!" });
      }
    }
  });
};

module.exports = {
  createTask,
  getTasksByState,
  approveDone,
};
