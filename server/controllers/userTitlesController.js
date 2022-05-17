const db = require("../database");

// Function to get all defined User titles (user groups) 
const getAllUserTitles = async () => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM user_titles", (err, result) => {
            return resolve(result);
          });
    });
};

// GET - User titles (user groups)
const userTitles = async (req, res) => {
    const result = await getAllUserTitles();
    res.json(result);
//   db.query("SELECT * FROM user_titles", (err, result) => {
//     res.json(result);
//   });
};

// POST - Create new user titles (user groups)
const addUserTitles = (req, res) => {
    const { projectRole } = req.body;
    db.query("SELECT * FROM user_titles WHERE title = ?", projectRole, (err, result) => {
        if (err) {
            res.json({ err: err });
        } else {
            if (result.length > 0) {
                res.json({ message: "Project role already exists!" });
            } else {
                db.query("INSERT INTO user_titles (title) VALUES (?)", projectRole, (err, result) => {
                    if (err) {
                        res.json({ err: err });
                    } else {
                        if (result) {
                            res.json({ message: "New project role created!" });
                        } else {
                            res.json({ message: "Failed to create new project role!" });
                        };
                    };
                });
            };
        };
    });
};

// GET - all users' user titles (user groups)
const getUsersTitles = (req, res) => {
  db.query("SELECT * FROM user_title_user", (err, result) => {
    res.json(result);
  });
};

// All users in Project Lead group
const projectLeadGroup = async () => {
    return new Promise((resolve, reject) => {
        db.query("SELECT username FROM user_title_user WHERE user_title = 'Project Lead' AND status = 'assigned'", (err, result) => {
            if (err) {
                resolve(false)
            } else {
                if (result.length > 0) {
                    return resolve(result)
                };
            };
        });
    });
};

// UPDATE insert into / update user_title_user table and insert into audit table (adding new project roles for user)
const addProjectRoleToUser = (req, res) => {
  const { userTitle, username, status } = req.body;
  userTitle.forEach((title) => {
    db.query(
      "SELECT * FROM user_title_user WHERE user_title = ? AND username = ?",
      [title, username],
      (err, result) => {
        if (err) {
          res.json({ err: err });
        } else {
          if (result.length > 0) {
            const id = result[0].id;
            db.query(
              "UPDATE user_title_user SET status = ? WHERE id = ?",
              [status, id],
              (err, result) => {
                if (result) {
                    // res.json({ message: "New project roles assigned to user successfully!" });
                  db.query(
                    "INSERT INTO user_title_user_audit (user_title, username, status) VALUES (?,?,?)",
                    [title, username, status]
                  );
                } else {
                  res.json({ message: "New project roles not added!" });
                }
              }
            );
          } else {
            db.query(
              "INSERT INTO user_title_user (user_title, username, status) VALUES (?,?,?)",
              [title, username, status],
              (err, result) => {
                if (err) {
                  res.json({ err: err });
                } else {
                  if (result) {
                    //   res.json({ message: "New project roles assigned to user successfully!" });
                    db.query(
                      "INSERT INTO user_title_user_audit (user_title, username, status) VALUES (?,?,?)",
                      [title, username, status]
                    );
                  } else {
                    res.json({ message: "New project roles not added!" });
                  }
                }
              }
            );
          }
        }
      }
    );
  });
};

// UPDATE user_title_user table and update user_title_user_audit status to unassigned where end_date is null (remove project roles for user)
const removeProjectRoleFromUser = (req, res) => {
  const { userTitle, username, status } = req.body;
  userTitle.forEach((title) => {
    db.query(
      "SELECT * FROM user_title_user WHERE user_title = ? AND username = ?",
      [title, username],
      (err, result) => {
        if (err) {
          res.json({ err: err });
        } else {
          if (result.length > 0) {
            const id = result[0].id;
            db.query(
              "UPDATE user_title_user SET status = ? WHERE id = ?",
              [status, id],
              (err, result) => {
                if (result) {
                    // res.json({ message: "Project Role removed from user successfully!" });
                  db.query(
                    "SELECT * FROM user_title_user_audit WHERE user_title = ? AND username = ?",
                    [title, username],
                    (err, result) => {
                      if (err) {
                        res.json({ err: err });
                      } else {
                        if (result.length > 0) {
                          result.map((element) => {
                            if (element.end_date === null) {
                              const id = element.id;
                              db.query(
                                "UPDATE user_title_user_audit SET status = ? WHERE id = ?",
                                [status, id],
                                (err, result) => {
                                  if (err) {
                                    res.json({ err: err });
                                  } else {
                                    if (result) {
                                      res.json({
                                        message:
                                          "Project Role removed from user successfully!",
                                      });
                                    } else {
                                      res.json({
                                        message: "Project Role not removed!",
                                      });
                                    }
                                  }
                                }
                              );
                            }
                          });
                        }
                      }
                    }
                  );
                } else {
                  res.json({ message: "Project Role not removed!" });
                }
              }
            );
          }
        }
      }
    );
  });
};

// Check group function
const checkGroup = async (username, userTitle) => {
    return new Promise((resolve, reject) => {
        db.query(
            "SELECT * FROM user_title_user WHERE user_title = ? AND username = ?",
            [userTitle, username],
            (err, result) => {
              if (err) {
                return resolve(false);
              } else {
                if (result.length > 0) {
                  if (result[0].status === "assigned") {
                    return resolve(true);
                  } else {
                    return resolve(false);
                  }
                } else {
                    return resolve(false);
                }
              }
            }
          );
    })
};


// GET check if user is in a project role group
const checkingGroup = async (req, res) => {
  const { userTitle, username } = req.params;
  const result = await checkGroup(username, userTitle);
  console.log(result);
  if (result) {
    res.json({ isInGroup: true });
  } else {
    res.json({ isInGroup: false });
  };
};

module.exports = {
  userTitles,
  getAllUserTitles,
  getUsersTitles,
  addUserTitles,
  addProjectRoleToUser,
  removeProjectRoleFromUser,
  checkGroup,
  checkingGroup,
  projectLeadGroup
};
