const db = require("../database");
const { checkGroup, projectLeadGroup } = require("../controllers/userTitlesController");
const { userByUsername } = require("../controllers/userController");
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "2c7bd9a8f2bf5b",
    pass: "754846d4a11766",
  },
});

// GET /tasks/:appAcronym/open - All tasks by task_app_acronym and state (open)
const getOpenTasksByAppAcronym = (req, res) => {
    const { appAcronym } = req.params;
    db.query("SELECT * FROM task WHERE task_app_acronym = ? AND task_state = 'open'", appAcronym, (err, result) => {
        if (err) {
            res.json({ err: err });
        } else {
            if (result.length > 0) {
                res.json(result);
            } else {
                res.json({ message: `No open tasks found for ${appAcronym}!`});
            };
        };
    });
};

// GET /tasks/:appAcronym/todo - All tasks by task_app_acronym and state (todo)
const getTodoTasksByAppAcronym = (req, res) => {
    const { appAcronym } = req.params;
    db.query("SELECT * FROM task WHERE task_app_acronym = ? AND task_state = 'todo'", appAcronym, (err, result) => {
        if (err) {
            res.json({ err: err });
        } else {
            if (result.length > 0) {
                res.json(result);
            } else {
                res.json(result);
            };
        };
    });
};

// GET /tasks/:appAcronym/doing - All tasks by task_app_acronym and state (doing)
const getDoingTasksByAppAcronym = (req, res) => {
    const { appAcronym } = req.params;
    db.query("SELECT * FROM task WHERE task_app_acronym = ? AND task_state = 'doing'", appAcronym, (err, result) => {
        if (err) {
            res.json({ err: err });
        } else {
            if (result.length > 0) {
                res.json(result);
            } else {
                res.json({ message: `No tasks in-progress found for ${appAcronym}!`});
            };
        };
    });
};

// GET /tasks/:appAcronym/done - All tasks by task_app_acronym and state (done)
const getDoneTasksByAppAcronym = (req, res) => {
    const { appAcronym } = req.params;
    db.query("SELECT * FROM task WHERE task_app_acronym = ? AND task_state = 'done'", appAcronym, (err, result) => {
        if (err) {
            res.json({ err: err });
        } else {
            if (result.length > 0) {
                res.json(result);
            } else {
                res.json({ message: `No tasks in-progress found for ${appAcronym}!`});
            };
        };
    });
};

// GET /tasks/:appAcronym/close - All tasks by task_app_acronym and state (close)
const getCloseTasksByAppAcronym = (req, res) => {
    const { appAcronym } = req.params;
    db.query("SELECT * FROM task WHERE task_app_acronym = ? AND task_state = 'close'", appAcronym, (err, result) => {
        if (err) {
            res.json({ err: err });
        } else {
            if (result.length > 0) {
                res.json(result);
            } else {
                res.json({ message: `No closed tasks found for ${appAcronym}!`});
            };
        };
    });
};

// GET /tasks/:appAcronym - All tasks by task_app_acronym
const getTasksByAppAcronym = (req, res) => {
    const { appAcronym } = req.params;
    db.query("SELECT * FROM task WHERE task_app_acronym = ?", appAcronym, (err, result) => {
        if (err) {
            res.json({ err: err });
        } else {
            if (result.length > 0) {
                res.json(result);
            } else {
                res.json({ message: `No tasks found for ${appAcronym}!` });
            };
        };
    });
};

// POST /tasks/create - Create task
const addNewTask = (req, res) => {
    const { taskName, taskDescription, taskNotes, taskId, taskPlan, taskAppAcronym, taskCreator, taskState } = req.body;
    db.query("INSERT INTO task (task_name, task_description, task_id, task_plan, task_app_acronym, task_creator) VALUES (?,?,?,?,?,?)", [taskName, taskDescription, taskId, taskPlan, taskAppAcronym, taskCreator], (err, result) => {
        if (err) {
            res.json({ err: err });
        } else {
            if (result) {
                db.query("SELECT * FROM application WHERE app_acronym = ?", taskAppAcronym, (err, result) => {
                    if (result) {
                        const appRnumber = result[0].app_Rnumber + 1
                        console.log(appRnumber);
                        db.query("UPDATE application SET app_Rnumber = ? WHERE app_acronym = ?", [appRnumber, taskAppAcronym]);
                    };
                });
                if (taskNotes !== "") {
                    db.query("INSERT INTO tasks_notes (task_notes, task_name, logon_user, task_state) VALUES (?,?,?,?)", [`${taskCreator} created task: '${taskName}' for plan: '${taskPlan}', with description: '${taskDescription}' and added notes: '${taskNotes}'.`, taskName, taskCreator, taskState], (err, result) => {
                        if (err) {
                            res.json({ err: err });
                        } else {
                            if (result) {
                                res.json({ message: "New task created!"});
                            } else {
                                res.json({ message: "Failed to create new task!"});
                            };
                        };
                    });
                } else {
                    db.query("INSERT INTO tasks_notes (task_notes, task_name, task_id, logon_user, task_state) VALUES (?,?,?,?,?)", [`${taskCreator} created task: ${taskName} for plan: '${taskPlan}', with description: '${taskDescription}'.`, taskName, taskId, taskCreator, taskState], (err, result) => {
                        if (err) {
                            res.json({ err: err });
                        } else {
                            if (result) {
                                res.json({ message: "New task created!"});
                            } else {
                                res.json({ message: "Failed to create new task!"});
                            };
                        };
                    });
                }
            } else {
                res.json({ message: "Failed to create new task!"});
            };
        };
    });
};

// POST - /task-notes/create - add task notes
const addNewTaskNotes = async (req, res) => {
    const { taskNotes, taskName, logonUser, taskState, taskId } = req.body;
    db.query("INSERT INTO tasks_notes (task_notes, task_name, logon_user, task_state, task_id) VALUES (?,?,?,?,?)", [`${logonUser} added task notes: '${taskNotes}'.`, taskName, logonUser, taskState, taskId], (err, result) => {
        if (err) {
            res.json({ err: err });
        } else {
            if (result) {
                res.json({ message: "Task notes added!" });
            } else {
                res.json({ message: "Failed to add task notes!" });
            };
        };
    });
};

// Function to get permissions of an app
const getTaskPermissions = async (appAcronym) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT app_permit_open, app_permit_toDoList, app_permit_doing, app_permit_done FROM application WHERE app_acronym = ?", appAcronym, (err, result) => {
            return resolve(result);
          });
    });
};

// GET /tasks/permissions/:appAcronym - permissions of an app
const taskPermissions = (req, res) => {
    const { appAcronym } = req.params;
    db.query("SELECT app_permit_create, app_permit_open, app_permit_toDoList, app_permit_doing, app_permit_done FROM application WHERE app_acronym = ?", appAcronym, (err, result) => {
        if (err) {
            res.json({ err: err });
        } else {
            if (result) {
                res.json(result);
            };
        };
    });
};

// PUT /tasks/update-state/:taskId - update task state
const updateTaskState = async (req, res) => {
    const { taskState, logonUser, taskName, appAcronym } = req.body;
    const { taskId } = req.params;
    const permissions = await getTaskPermissions(appAcronym);
    let emails = [];
    projectLeadGroup().then(data => {
        console.log(data);
        data.map((user) => {
            userByUsername(user.username).then(userInfo => {
                if (userInfo[0].status === 'active') {
                    emails.push(userInfo[0].email);
                };
            });
        });
    });
    // console.log(permissions);
    // console.log(logonUser);
    db.query("SELECT * FROM task WHERE task_id = ?", taskId, (err, result) => {
        if (err) {
            res.json({ err: err });
        } else {
            // check permission to update, update task owner to logonUser
            if (result[0].task_state === 'open') {
                checkGroup(logonUser, permissions[0].app_permit_open).then(data => {
                    console.log(data);
                    if (data) {
                        if (taskState !== 'todo') {
                            res.json({ message: "You do not have the permission!" })
                        } else {
                            db.query("UPDATE task SET task_state = ?, task_owner = ? WHERE task_id = ?", [taskState, logonUser, taskId], (err, result) => {
                                if (err) {
                                    res.json({ err: err });
                                } else {
                                    if (result) {
                                        db.query("INSERT INTO tasks_notes (task_notes, task_name, logon_user, task_state, task_id) VALUES (?,?,?,?,?)", [`${logonUser} updated task to '${taskState}'`, taskName, logonUser, taskState, taskId], (err, result) => {
                                            if (err) {
                                                res.json({ err: err });
                                            } else {
                                                if (result) {
                                                    res.json({ message: "Task state updated" });
                                                } else {
                                                    res.json({ message: "Task state not updated" });
                                                };
                                            };
                                        });
                                    } else {
                                        res.json({ message: "Task state not updated" });
                                    };
                                };
                            });
                        };
                    } else {
                        res.json({ message: "You do not have the permission!" });
                    };
                }).catch(err => {
                    console.log(err);
                });
            } else if (result[0].task_state === 'todo') {
                checkGroup(logonUser, permissions[0].app_permit_toDoList).then(data => {
                    console.log(data);
                    if (data) {
                        if (taskState !== 'doing') {
                            res.json({ message: "You do not have the permission!" })
                        } else {
                            db.query("UPDATE task SET task_state = ?, task_owner = ? WHERE task_id = ?", [taskState, logonUser, taskId], (err, result) => {
                                if (err) {
                                    res.json({ err: err });
                                } else {
                                    if (result) {
                                        db.query("INSERT INTO tasks_notes (task_notes, task_name, logon_user, task_state, task_id) VALUES (?,?,?,?,?)", [`${logonUser} updated task to '${taskState}'`, taskName, logonUser, taskState, taskId], (err, result) => {
                                            if (err) {
                                                res.json({ err: err });
                                            } else {
                                                if (result) {
                                                    res.json({ message: "Task state updated" });
                                                } else {
                                                    res.json({ message: "Task state not updated" });
                                                };
                                            };
                                        });
                                    } else {
                                        res.json({ message: "Task state not updated" });
                                    };
                                };
                            });
                        };
                    } else {
                        res.json({ message: "You do not have the permission!" });
                    };
                }).catch(err => {
                    console.log(err);
                });
            } else if (result[0].task_state === 'doing') {
                checkGroup(logonUser, permissions[0].app_permit_doing).then(data => {
                    console.log(data);
                    if (data) {
                        if (taskState === 'todo') {
                            db.query("UPDATE task SET task_state = ?, task_owner = ? WHERE task_id = ?", [taskState, logonUser, taskId], (err, result) => {
                                if (err) {
                                    res.json({ err: err });
                                } else {
                                    if (result) {
                                        db.query("INSERT INTO tasks_notes (task_notes, task_name, logon_user, task_state, task_id) VALUES (?,?,?,?,?)", [`${logonUser} updated task to '${taskState}'`, taskName, logonUser, taskState, taskId], (err, result) => {
                                            if (err) {
                                                res.json({ err: err });
                                            } else {
                                                if (result) {
                                                    res.json({ message: "Task state updated" });
                                                } else {
                                                    res.json({ message: "Task state not updated" });
                                                };
                                            };
                                        });
                                    } else {
                                        res.json({ message: "Task state not updated" });
                                    };
                                };
                            });
                        } else if (taskState === 'done') {
                            db.query("UPDATE task SET task_state = ?, task_owner = ? WHERE task_id = ?", [taskState, logonUser, taskId], (err, result) => {
                                if (err) {
                                    res.json({ err: err });
                                } else {
                                    if (result) {
                                        db.query("INSERT INTO tasks_notes (task_notes, task_name, logon_user, task_state, task_id) VALUES (?,?,?,?,?)", [`${logonUser} updated task to '${taskState}'`, taskName, logonUser, taskState, taskId], (err, result) => {
                                            if (err) {
                                                res.json({ err: err });
                                            } else {
                                                if (result) {
                                                    emails.map((email) => {
                                                        let message = {
                                                            from: "tms@email.com",
                                                            to: email,
                                                            subject: `[For Review] ${taskId}: ${taskName} updated to 'Done'`,
                                                            text: `${taskId}: ${taskName} is updated to 'Done' by ${logonUser}. Please kindly review.`,
                                                            html: `<h1>${taskId}: ${taskName} is updated to 'Done' by ${logonUser}. Please kindly review.</h1>`,
                                                          };
                                                        transporter.sendMail(message, (err, info) => {
                                                              if (err) {
                                                                console.log(err);
                                                              } else {
                                                                console.log(info);
                                                              }
                                                        });
                                                    });
                                                    res.json({ message: "Task state updated" });
                                                } else {
                                                    res.json({ message: "Task state not updated" });
                                                };
                                            };
                                        });
                                    } else {
                                        res.json({ message: "Task state not updated" });
                                    };
                                };
                            });
                        } else {
                            res.json({ message: "You do not have the permission!" });
                        }
                    } else {
                        res.json({ message: "You do not have the permission!" });
                    }
                }).catch(err => {
                    console.log(err);
                });
            } else {
                checkGroup(logonUser, permissions[0].app_permit_done).then(data => {
                    console.log(data);
                    if (data) {
                        if (taskState === 'doing') {
                            db.query("UPDATE task SET task_state = ?, task_owner = ? WHERE task_id = ?", [taskState, logonUser, taskId], (err, result) => {
                                if (err) {
                                    res.json({ err: err });
                                } else {
                                    if (result) {
                                        db.query("INSERT INTO tasks_notes (task_notes, task_name, logon_user, task_state, task_id) VALUES (?,?,?,?,?)", [`${logonUser} updated task to '${taskState}'`, taskName, logonUser, taskState, taskId], (err, result) => {
                                            if (err) {
                                                res.json({ err: err });
                                            } else {
                                                if (result) {
                                                    res.json({ message: "Task state updated" });
                                                } else {
                                                    res.json({ message: "Task state not updated" });
                                                };
                                            };
                                        });
                                    } else {
                                        res.json({ message: "Task state not updated" });
                                    };
                                };
                            });
                        } else if (taskState === 'close') {
                            db.query("UPDATE task SET task_state = ?, task_owner = ? WHERE task_id = ?", [taskState, logonUser, taskId], (err, result) => {
                                if (err) {
                                    res.json({ err: err });
                                } else {
                                    if (result) {
                                        db.query("INSERT INTO tasks_notes (task_notes, task_name, logon_user, task_state, task_id) VALUES (?,?,?,?,?)", [`${logonUser} updated task to '${taskState}'`, taskName, logonUser, taskState, taskId], (err, result) => {
                                            if (err) {
                                                res.json({ err: err });
                                            } else {
                                                if (result) {
                                                    res.json({ message: "Task state updated" });
                                                } else {
                                                    res.json({ message: "Task state not updated" });
                                                };
                                            };
                                        });
                                    } else {
                                        res.json({ message: "Task state not updated" });
                                    };
                                };
                            });
                        } else {
                            res.json({ message: "You do not have the permission!" })
                        }
                    } else {
                        res.json({ message: "You do not have the permission!" });
                    };
                }).catch(err => {
                    console.log(err);
                });
            };
            // if (result[0].task_state === 'open') {
            //     if (permissions[0].app_permit_open.includes(',')) {
            //         permissions[0].app_permit_open.split(',').map(async group => {
            //             let inGroup = await checkGroup(logonUser, group);
            //             if (inGroup) {
            //                 if (taskState !== 'todo') {
            //                     res.json({ message: "You do not have the permission!" })
            //                 } else {
            //                     db.query("UPDATE task SET task_state = ?, task_owner = ? WHERE task_id = ?", [taskState, logonUser, taskId], (err, result) => {
            //                         if (err) {
            //                             res.json({ err: err });
            //                         } else {
            //                             if (result) {
            //                                 db.query("INSERT INTO tasks_notes (task_notes, task_name, logon_user, task_state, task_id) VALUES (?,?,?,?,?)", [`${logonUser} updated task to '${taskState}'`, taskName, logonUser, taskState, taskId], (err, result) => {
            //                                     if (err) {
            //                                         res.json({ err: err });
            //                                     } else {
            //                                         if (result) {
            //                                             res.json({ message: "Task state updated" });
            //                                         } else {
            //                                             res.json({ message: "Task state not updated" });
            //                                         };
            //                                     };
            //                                 });
            //                             } else {
            //                                 res.json({ message: "Task state not updated" });
            //                             };
            //                         };
            //                     });
            //                 };
            //             } else {
            //                 res.json({ message: "You do not have the permission!" });
            //             };
            //         });
            //     } else {
                    // checkGroup(logonUser, permissions[0].app_permit_open).then(data => {
                    //     console.log(data);
                    //     if (data) {
                    //         if (taskState !== 'todo') {
                    //             res.json({ message: "You do not have the permission!" })
                    //         } else {
                    //             db.query("UPDATE task SET task_state = ?, task_owner = ? WHERE task_id = ?", [taskState, logonUser, taskId], (err, result) => {
                    //                 if (err) {
                    //                     res.json({ err: err });
                    //                 } else {
                    //                     if (result) {
                    //                         db.query("INSERT INTO tasks_notes (task_notes, task_name, logon_user, task_state, task_id) VALUES (?,?,?,?,?)", [`${logonUser} updated task to '${taskState}'`, taskName, logonUser, taskState, taskId], (err, result) => {
                    //                             if (err) {
                    //                                 res.json({ err: err });
                    //                             } else {
                    //                                 if (result) {
                    //                                     res.json({ message: "Task state updated" });
                    //                                 } else {
                    //                                     res.json({ message: "Task state not updated" });
                    //                                 };
                    //                             };
                    //                         });
                    //                     } else {
                    //                         res.json({ message: "Task state not updated" });
                    //                     };
                    //                 };
                    //             });
                    //         };
                    //     } else {
                    //         res.json({ message: "You do not have the permission!" });
                    //     };
                    // }).catch(err => {
                    //     console.log(err);
                    // });
            //     }
            // } else if (result[0].task_state === 'todo') {
            //     if (permissions[0].app_permit_toDoList.includes(',')) {
            //         permissions[0].app_permit_toDoList.split(',').map(async group => {
            //             let inGroup = await checkGroup(logonUser, group);
            //             if (inGroup) {
            //                 if (taskState !== 'doing') {
            //                     res.json({ message: "You do not have the permission!" })
            //                 } else {
            //                     db.query("UPDATE task SET task_state = ?, task_owner = ? WHERE task_id = ?", [taskState, logonUser, taskId], (err, result) => {
            //                         if (err) {
            //                             res.json({ err: err });
            //                         } else {
            //                             if (result) {
            //                                 db.query("INSERT INTO tasks_notes (task_notes, task_name, logon_user, task_state, task_id) VALUES (?,?,?,?,?)", [`${logonUser} updated task to '${taskState}'`, taskName, logonUser, taskState, taskId], (err, result) => {
            //                                     if (err) {
            //                                         res.json({ err: err });
            //                                     } else {
            //                                         if (result) {
            //                                             res.json({ message: "Task state updated" });
            //                                         } else {
            //                                             res.json({ message: "Task state not updated" });
            //                                         };
            //                                     };
            //                                 });
            //                             } else {
            //                                 res.json({ message: "Task state not updated" });
            //                             };
            //                         };
            //                     });
            //                 };
            //             } else {
            //                 res.json({ message: "You do not have the permission!" });
            //             };
            //         });
            //     } else {
                    // checkGroup(logonUser, permissions[0].app_permit_toDoList).then(data => {
                    //     console.log(data);
                    //     if (data) {
                    //         if (taskState !== 'doing') {
                    //             res.json({ message: "You do not have the permission!" })
                    //         } else {
                    //             db.query("UPDATE task SET task_state = ?, task_owner = ? WHERE task_id = ?", [taskState, logonUser, taskId], (err, result) => {
                    //                 if (err) {
                    //                     res.json({ err: err });
                    //                 } else {
                    //                     if (result) {
                    //                         db.query("INSERT INTO tasks_notes (task_notes, task_name, logon_user, task_state, task_id) VALUES (?,?,?,?,?)", [`${logonUser} updated task to '${taskState}'`, taskName, logonUser, taskState, taskId], (err, result) => {
                    //                             if (err) {
                    //                                 res.json({ err: err });
                    //                             } else {
                    //                                 if (result) {
                    //                                     res.json({ message: "Task state updated" });
                    //                                 } else {
                    //                                     res.json({ message: "Task state not updated" });
                    //                                 };
                    //                             };
                    //                         });
                    //                     } else {
                    //                         res.json({ message: "Task state not updated" });
                    //                     };
                    //                 };
                    //             });
                    //         };
                    //     } else {
                    //         res.json({ message: "You do not have the permission!" });
                    //     };
                    // }).catch(err => {
                    //     console.log(err);
                    // });
            //     }
            // } else if (result[0].task_state === 'doing') {
            //     if (permissions[0].app_permit_doing.includes(',')) {
            //         permissions[0].app_permit_doing.split(',').map(async group => {
            //             let inGroup = await checkGroup(logonUser, group);
            //             if (inGroup) {
            //                 if (taskState === 'todo') {
            //                     db.query("UPDATE task SET task_state = ?, task_owner = ? WHERE task_id = ?", [taskState, logonUser, taskId], (err, result) => {
            //                         if (err) {
            //                             res.json({ err: err });
            //                         } else {
            //                             if (result) {
            //                                 db.query("INSERT INTO tasks_notes (task_notes, task_name, logon_user, task_state, task_id) VALUES (?,?,?,?,?)", [`${logonUser} updated task to '${taskState}'`, taskName, logonUser, taskState, taskId], (err, result) => {
            //                                     if (err) {
            //                                         res.json({ err: err });
            //                                     } else {
            //                                         if (result) {
            //                                             res.json({ message: "Task state updated" });
            //                                         } else {
            //                                             res.json({ message: "Task state not updated" });
            //                                         };
            //                                     };
            //                                 });
            //                             } else {
            //                                 res.json({ message: "Task state not updated" });
            //                             };
            //                         };
            //                     });
            //                 } else if (taskState === 'done') {
            //                     db.query("UPDATE task SET task_state = ?, task_owner = ? WHERE task_id = ?", [taskState, logonUser, taskId], (err, result) => {
            //                         if (err) {
            //                             res.json({ err: err });
            //                         } else {
            //                             if (result) {
            //                                 db.query("INSERT INTO tasks_notes (task_notes, task_name, logon_user, task_state, task_id) VALUES (?,?,?,?,?)", [`${logonUser} updated task to '${taskState}'`, taskName, logonUser, taskState, taskId], (err, result) => {
            //                                     if (err) {
            //                                         res.json({ err: err });
            //                                     } else {
            //                                         if (result) {
            //                                             res.json({ message: "Task state updated" });
            //                                         } else {
            //                                             res.json({ message: "Task state not updated" });
            //                                         };
            //                                     };
            //                                 });
            //                             } else {
            //                                 res.json({ message: "Task state not updated" });
            //                             };
            //                         };
            //                     });
            //                 } else {
            //                     res.json({ message: "You do not have the permission!" });
            //                 };
            //             } else {
            //                 res.json({ message: "You do not have the permission!" });
            //             };
            //         });
            //     } else {
                    // checkGroup(logonUser, permissions[0].app_permit_doing).then(data => {
                    //     console.log(data);
                    //     if (data) {
                    //         if (taskState === 'todo') {
                    //             db.query("UPDATE task SET task_state = ?, task_owner = ? WHERE task_id = ?", [taskState, logonUser, taskId], (err, result) => {
                    //                 if (err) {
                    //                     res.json({ err: err });
                    //                 } else {
                    //                     if (result) {
                    //                         db.query("INSERT INTO tasks_notes (task_notes, task_name, logon_user, task_state, task_id) VALUES (?,?,?,?,?)", [`${logonUser} updated task to '${taskState}'`, taskName, logonUser, taskState, taskId], (err, result) => {
                    //                             if (err) {
                    //                                 res.json({ err: err });
                    //                             } else {
                    //                                 if (result) {
                    //                                     res.json({ message: "Task state updated" });
                    //                                 } else {
                    //                                     res.json({ message: "Task state not updated" });
                    //                                 };
                    //                             };
                    //                         });
                    //                     } else {
                    //                         res.json({ message: "Task state not updated" });
                    //                     };
                    //                 };
                    //             });
                    //         } else if (taskState === 'done') {
                    //             db.query("UPDATE task SET task_state = ?, task_owner = ? WHERE task_id = ?", [taskState, logonUser, taskId], (err, result) => {
                    //                 if (err) {
                    //                     res.json({ err: err });
                    //                 } else {
                    //                     if (result) {
                    //                         db.query("INSERT INTO tasks_notes (task_notes, task_name, logon_user, task_state, task_id) VALUES (?,?,?,?,?)", [`${logonUser} updated task to '${taskState}'`, taskName, logonUser, taskState, taskId], (err, result) => {
                    //                             if (err) {
                    //                                 res.json({ err: err });
                    //                             } else {
                    //                                 if (result) {
                    //                                     res.json({ message: "Task state updated" });
                    //                                 } else {
                    //                                     res.json({ message: "Task state not updated" });
                    //                                 };
                    //                             };
                    //                         });
                    //                     } else {
                    //                         res.json({ message: "Task state not updated" });
                    //                     };
                    //                 };
                    //             });
                    //         } else {
                    //             res.json({ message: "You do not have the permission!" });
                    //         }
                    //     } else {
                    //         res.json({ message: "You do not have the permission!" });
                    //     }
                    // }).catch(err => {
                    //     console.log(err);
                    // });
            //     };
            // } else {
            //     if (permissions[0].app_permit_done.includes(',')) {
            //         permissions[0].app_permit_done.split(',').map(async group => {
            //             let inGroup = await checkGroup(logonUser, group);
            //             if (inGroup) {
            //                 if (taskState === 'doing') {
            //                     db.query("UPDATE task SET task_state = ?, task_owner = ? WHERE task_id = ?", [taskState, logonUser, taskId], (err, result) => {
            //                         if (err) {
            //                             res.json({ err: err });
            //                         } else {
            //                             if (result) {
            //                                 db.query("INSERT INTO tasks_notes (task_notes, task_name, logon_user, task_state, task_id) VALUES (?,?,?,?,?)", [`${logonUser} updated task to '${taskState}'`, taskName, logonUser, taskState, taskId], (err, result) => {
            //                                     if (err) {
            //                                         res.json({ err: err });
            //                                     } else {
            //                                         if (result) {
            //                                             res.json({ message: "Task state updated" });
            //                                         } else {
            //                                             res.json({ message: "Task state not updated" });
            //                                         };
            //                                     };
            //                                 });
            //                             } else {
            //                                 res.json({ message: "Task state not updated" });
            //                             };
            //                         };
            //                     });
            //                 } else if (taskState === 'close') {
            //                     db.query("UPDATE task SET task_state = ?, task_owner = ? WHERE task_id = ?", [taskState, logonUser, taskId], (err, result) => {
            //                         if (err) {
            //                             res.json({ err: err });
            //                         } else {
            //                             if (result) {
            //                                 db.query("INSERT INTO tasks_notes (task_notes, task_name, logon_user, task_state, task_id) VALUES (?,?,?,?,?)", [`${logonUser} updated task to '${taskState}'`, taskName, logonUser, taskState, taskId], (err, result) => {
            //                                     if (err) {
            //                                         res.json({ err: err });
            //                                     } else {
            //                                         if (result) {
            //                                             res.json({ message: "Task state updated" });
            //                                         } else {
            //                                             res.json({ message: "Task state not updated" });
            //                                         };
            //                                     };
            //                                 });
            //                             } else {
            //                                 res.json({ message: "Task state not updated" });
            //                             };
            //                         };
            //                     });
            //                 } else {
            //                     res.json({ message: "You do not have the permission!" })
            //                 }
            //             } else {
            //                 res.json({ message: "You do not have the permission!" });
            //             };
            //         });
            //     } else {
                    // checkGroup(logonUser, permissions[0].app_permit_done).then(data => {
                    //     console.log(data);
                    //     if (data) {
                    //         if (taskState === 'doing') {
                    //             db.query("UPDATE task SET task_state = ?, task_owner = ? WHERE task_id = ?", [taskState, logonUser, taskId], (err, result) => {
                    //                 if (err) {
                    //                     res.json({ err: err });
                    //                 } else {
                    //                     if (result) {
                    //                         db.query("INSERT INTO tasks_notes (task_notes, task_name, logon_user, task_state, task_id) VALUES (?,?,?,?,?)", [`${logonUser} updated task to '${taskState}'`, taskName, logonUser, taskState, taskId], (err, result) => {
                    //                             if (err) {
                    //                                 res.json({ err: err });
                    //                             } else {
                    //                                 if (result) {
                    //                                     res.json({ message: "Task state updated" });
                    //                                 } else {
                    //                                     res.json({ message: "Task state not updated" });
                    //                                 };
                    //                             };
                    //                         });
                    //                     } else {
                    //                         res.json({ message: "Task state not updated" });
                    //                     };
                    //                 };
                    //             });
                    //         } else if (taskState === 'close') {
                    //             db.query("UPDATE task SET task_state = ?, task_owner = ? WHERE task_id = ?", [taskState, logonUser, taskId], (err, result) => {
                    //                 if (err) {
                    //                     res.json({ err: err });
                    //                 } else {
                    //                     if (result) {
                    //                         db.query("INSERT INTO tasks_notes (task_notes, task_name, logon_user, task_state, task_id) VALUES (?,?,?,?,?)", [`${logonUser} updated task to '${taskState}'`, taskName, logonUser, taskState, taskId], (err, result) => {
                    //                             if (err) {
                    //                                 res.json({ err: err });
                    //                             } else {
                    //                                 if (result) {
                    //                                     res.json({ message: "Task state updated" });
                    //                                 } else {
                    //                                     res.json({ message: "Task state not updated" });
                    //                                 };
                    //                             };
                    //                         });
                    //                     } else {
                    //                         res.json({ message: "Task state not updated" });
                    //                     };
                    //                 };
                    //             });
                    //         } else {
                    //             res.json({ message: "You do not have the permission!" })
                    //         }
                    //     } else {
                    //         res.json({ message: "You do not have the permission!" });
                    //     };
                    // }).catch(err => {
                    //     console.log(err);
                    // });
            //     }
            // }
        };
    });
};

// PUT /tasks/update/:taskId - update task description, task plan
const updateTask = async (req, res) => {
    const { taskState, logonUser, taskName, taskDescription, taskPlan, appAcronym } = req.body;
    const { taskId } = req.params;
    const permissions = await getTaskPermissions(appAcronym);
    db.query("SELECT * FROM task WHERE task_id = ?", taskId, (err, result) => {
        if (err) {
            res.json({ err: err });
        } else {
            if (result[0].task_state === "open") {
                checkGroup(logonUser, permissions[0].app_permit_open).then(data => {
                    if (data) {
                        if (taskDescription === "" && taskPlan === "") {
                            res.json({ message: "Please fill in description or plan!" });
                        } else if (taskDescription === "" && taskPlan !== "") {
                            db.query("UPDATE task SET task_plan = ? WHERE task_id = ?", [taskPlan, taskId], (err, result) => {
                                if (err) {
                                    res.json({ err: err });
                                } else {
                                    if (result) {
                                        db.query("INSERT INTO tasks_notes (task_notes, task_name, logon_user, task_state, task_id) VALUES (?,?,?,?,?)", [`${logonUser} updated task plan: '${taskPlan}'`, taskName, logonUser, taskState, taskId], (err, result) => {
                                            if (err) {
                                                res.json({ err: err });
                                            } else {
                                                if (result) {
                                                    res.json({ message: "Task updated!" });
                                                } else {
                                                    res.json({ message: "Task not updated" });
                                                };
                                            };
                                        });
                                    } else {
                                        res.json({ message: "Task not updated!" });
                                    };
                                };
                            });
                        } else if (taskDescription !== "" && taskPlan === "") {
                            db.query("UPDATE task SET task_description = ? WHERE task_id = ?", [taskDescription, taskId], (err, result) => {
                                if (err) {
                                    res.json({ err: err });
                                } else {
                                    if (result) {
                                        db.query("INSERT INTO tasks_notes (task_notes, task_name, logon_user, task_state, task_id) VALUES (?,?,?,?,?)", [`${logonUser} updated task description: '${taskDescription}'`, taskName, logonUser, taskState, taskId], (err, result) => {
                                            if (err) {
                                                res.json({ err: err });
                                            } else {
                                                if (result) {
                                                    res.json({ message: "Task updated!" });
                                                } else {
                                                    res.json({ message: "Task not updated" });
                                                };
                                            };
                                        });
                                    } else {
                                        res.json({ message: "Task not updated!" });
                                    };
                                };
                            });
                        } else {
                            db.query("UPDATE task SET task_description = ?, task_plan = ? WHERE task_id = ?", [taskDescription, taskPlan, taskId], (err, result) => {
                                if (err) {
                                    res.json({ err: err });
                                } else {
                                    if (result) {
                                        db.query("INSERT INTO tasks_notes (task_notes, task_name, logon_user, task_state, task_id) VALUES (?,?,?,?,?)", [`${logonUser} updated task description: '${taskDescription}' and updated task plan: '${taskPlan}'`, taskName, logonUser, taskState, taskId], (err, result) => {
                                            if (err) {
                                                res.json({ err: err });
                                            } else {
                                                if (result) {
                                                    res.json({ message: "Task updated!" });
                                                } else {
                                                    res.json({ message: "Task not updated" });
                                                };
                                            };
                                        });
                                    } else {
                                        res.json({ message: "Task not updated!" });
                                    };
                                };
                            });
                        };
                    } else {
                        res.json({ message: "You do not have the permission!" });
                    };
                });
            } else {
                res.json({ message: "You do not have the permission!" });
            };
        };
    });
};

// GET /task-notes - all task notes
const getAllTaskNotes = (req, res) => {
    db.query("SELECT * FROM tasks_notes", (err, result) => {
        if (err) {
            res.json({ err: err });
        } else {
            if (result.length > 0) {
                res.json(result);
            } else {
                res.json({ message: "No task notes!" });
            };
        };
    });
};

module.exports = {
    getTasksByAppAcronym,
    getOpenTasksByAppAcronym,
    getTodoTasksByAppAcronym,
    getDoingTasksByAppAcronym,
    getDoneTasksByAppAcronym,
    getCloseTasksByAppAcronym,
    addNewTask,
    addNewTaskNotes,
    updateTaskState,
    updateTask,
    getAllTaskNotes,
    taskPermissions
}