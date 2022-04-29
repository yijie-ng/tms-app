const db = require("../database");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { createToken } = require("../jwt");

// GET /users - All users
const users = (req, res) => {
  db.query("SELECT * FROM accounts", (err, result) => {
    res.json(result);
  });
};

// GET /users/:id - Get user by Id
const userById = (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM accounts WHERE id = ?", id, (err, result) => {
    res.json(result);
  });
};

// POST /register - Create user
const createUser = (req, res) => {
  const {
    firstName,
    lastName,
    username,
    email,
    userRole,
    userTitle,
    password,
    userGroup,
    projectRoleStatus
  } = req.body;
  db.query(
    "SELECT * FROM accounts WHERE username =?",
    username,
    (err, result) => {
      if (result.length > 0) {
        res.json({ message: "Username already taken!" });
      } else {
        db.query(
          "SELECT * FROM accounts WHERE email = ?",
          email,
          (err, result) => {
            if (result.length > 0) {
              res.json({ message: "Email already in database!" });
            } else {
              bcrypt.hash(password, saltRounds).then((hash) => {
                db.query(
                  "INSERT INTO accounts (firstName, lastName, username, email, user_role, password) VALUES (?,?,?,?,?,?)",
                  [firstName, lastName, username, email, userRole, hash],
                  (err, result) => {
                    if (err) {
                      res.json({ err: err });
                    } else {
                      if (result) {
                        userTitle.forEach((title) => {
                          db.query("INSERT INTO user_title_user (user_title, username, status) VALUES (?,?,?)", [title, username, projectRoleStatus], (err, result) => {
                              if (result) {
                                db.query("INSERT INTO user_title_user_audit (user_title, username, status) VALUES (?,?,?)", [title, username, projectRoleStatus]);
                              };
                          });
                        });
                        userGroup.forEach((group) => {
                          db.query(
                            "INSERT INTO user_group_users (group_name, username) VALUES (?,?)",
                            [group, username]
                          );
                        });
                        res.json({ message: "User created successfully!" });
                      } else {
                        res.json({ message: "User not created! " });
                      }
                    }
                  }
                );
              });
            }
          }
        );
      }
    }
  );
};

// POST /login - User Login
const login = (req, res) => {
  const { username, password } = req.body;
  db.query(
    "SELECT * FROM accounts WHERE username = ?",
    [username],
    (err, results) => {
      if (err) {
        res.json({ err: err });
      } else {
        if (results.length > 0) {
          const user = results[0];
          const role = user.user_role;
          const id = user.id;
          const userStatus = user.status;
          bcrypt.compare(password, user.password, (err, result) => {
            if (result) {
              // req.session.user = user;
              // Attach token to user if logged in
              const accessToken = createToken(user);
              res.cookie("access-token", accessToken, {
                maxAge: 60 * 60 * 24 * 1000,
                httpOnly: true,
              });
              res.json({
                id,
                role,
                userStatus,
                accessToken,
                message: "Login successful!",
              });
            } else {
              res.json({ message: "Invalid Password!" });
            }
          });
        } else {
          res.json({ message: "Invalid Username!" });
        }
      }
    }
  );
};

// PUT - Update user email only
const updateUserEmail = (req, res) => {
  const { email } = req.body;
  const id = req.params.id;
  db.query(
    "UPDATE accounts SET email = ? WHERE id = ?",
    [email, id],
    (err, result) => {
      if (err) {
        res.json({ err: err });
      } else {
        res.json({ message: "Email updated!" });
      }
    }
  );
};

// PUT - Update user password only
const updateUserPassword = (req, res) => {
  const { password } = req.body;
  const id = req.params.id;
  bcrypt.hash(password, saltRounds).then((hash) => {
    db.query(
      "UPDATE accounts SET password = ? WHERE id = ?",
      [hash, id],
      (err, result) => {
        if (err) {
          res.json({ err: err });
        } else {
          res.json({ message: "Password updated!" });
        }
      }
    );
  });
};

// PUT - update user's status
const updateUserStatus = (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  db.query(
    "UPDATE accounts SET status = ? WHERE id = ?",
    [status, id],
    (err, result) => {
      if (err) {
        res.json({ err: err });
      } else {
        res.json({ message: "Status updated!" });
      }
    }
  );
};

// PUT - Admin update user details, Update User by id, should able to update email, password, disable user, user's role, title & group
const updateUserInfo = (req, res) => {
  const id = req.params.id;
  const { firstName, lastName, email, userRole, userTitle, userStatus } =
    req.body;
  db.query(
    "UPDATE accounts SET firstName = ?, lastName = ?, email = ?, user_role = ?, user_title = ?, status = ? WHERE id = ?",
    [firstName, lastName, email, userRole, userTitle, userStatus, id],
    (err, result) => {
      if (err) {
        res.json({ err: err });
      } else {
        res.json({ message: "User updated!" });
      }
    }
  );
};

// GET /user-roles - User roles (account type)
const userRoles = (req, res) => {
  db.query("SELECT * FROM user_roles", (err, result) => {
    res.json(result);
  });
};

// GET - User titles (project roles)
const userTitles = (req, res) => {
  db.query("SELECT * FROM user_titles", (err, result) => {
    res.json(result);
  });
};

// GET - all users' user titles (project roles)
const getUsersTitles = (req, res) => {
  db.query("SELECT * FROM user_title_user", (err, result) => {
    res.json(result);
  });
};

// GET - User groups /user-groups (project groups)
const userGroups = (req, res) => {
  db.query("SELECT * FROM user_group", (err, result) => {
    res.json(result);
  });
};

// POST - add new user groups (project groups)
const addUserGroup = (req, res) => {
  const { groupName } = req.body;
  db.query(
    "SELECT * FROM user_group WHERE group_name = ?",
    groupName,
    (err, result) => {
      if (result.length > 0) {
        res.json({ message: "Group name already taken!" });
      } else {
        db.query(
          "INSERT INTO user_group (group_name) VALUES (?)",
          groupName,
          (err, result) => {
            if (err) {
              res.json({ err: err });
            } else {
              res.json({ message: "New group created!" });
            }
          }
        );
      }
    }
  );
};

// GET - User's user groups /user-groups/:username
// const getUsersUserGroups = (req, res) => {
//   const username = req.params.username;
//   db.query(
//     "SELECT group_name FROM user_group_users WHERE username = ?",
//     username,
//     (err, result) => {
//       res.json(result);
//     }
//   );
// };

// GET whole list of users' user group (project groups)
const getUsersGroups = (req, res) => {
  db.query("SELECT * FROM user_group_users", (err, result) => {
    res.json(result);
  });
};

// UPDATE insert into / update user_title_user table and insert into audit table (adding new project roles for user)
const addProjectRoleToUser = (req, res) => {
  const { userTitle, username, status } = req.body;
  userTitle.forEach((title) => {
      db.query("SELECT * FROM user_title_user WHERE user_title = ? AND username = ?", [title, username], (err, result) => {
          if (err) {
              res.json({ err: err });
          } else {
              if (result.length > 0) {
                  const id = result[0].id;
                  db.query("UPDATE user_title_user SET status = ? WHERE id = ?", [status, id], (err, result) => {
                      if (result) {
                          db.query("INSERT INTO user_title_user_audit (user_title, username, status) VALUES (?,?,?)", [title, username, status], (err, result) => {
                              if (err) {
                                  res.json({ err: err });
                              } else {
                                  if (result) {
                                      res.json({ message: "New roles assigned to user successfully!" });
                                  } else {
                                      res.json({ message: "New roles not added into audit!" });
                                  };
                              };
                          });
                      } else {
                          res.json({ message: "New roles not added!" });
                      };
                  });
              } else {
                  db.query("INSERT INTO user_title_user (user_title, username, status) VALUES (?,?,?)", [title, username, status], (err, result) => {
                      if (err) {
                          res.json({ err: err });
                      } else {
                          if (result) {
                            db.query("INSERT INTO user_title_user_audit (user_title, username, status) VALUES (?,?,?)", [title, username, status], (err, result) => {
                                if (err) {
                                    res.json({ err: err });
                                } else {
                                    if (result) {
                                        res.json({ message: "New roles assigned to user successfully!" });
                                    } else {
                                        res.json({ message: "New roles not added into audit!" });
                                    };
                                };
                            });
                          } else {
                            res.json({ message: "New roles not added!" });
                          };
                      };
                  });
              };
          };
      });
  });
};

// UPDATE user_title_user table and update user_title_user_audit status to unassigned where end_date is null (remove project roles for user)
const removeProjectRoleFromUser = (req, res) => {
  const { userTitle, username, status } = req.body;
  userTitle.forEach((title) => {
      db.query("SELECT * FROM user_title_user WHERE user_title = ? AND username = ?", [title, username], (err, result) => {
          if (err) {
              res.json({ err: err });
          } else {
              if (result.length > 0) {
                  const id = result[0].id;
                  db.query("UPDATE user_title_user SET status = ? WHERE id = ?", [status, id], (err, result) => {
                      if (result) {
                          db.query("SELECT * FROM user_title_user_audit WHERE user_title = ? AND username = ?", [title, username], (err, result) => {
                              if (err) {
                                  res.json({ err: err});
                              } else {
                                  if (result.length > 0) {
                                      result.map((element) => {
                                          if (element.end_date === null) {
                                              const id = result[0].id;
                                              db.query("UPDATE user_title_user_audit SET status = ? WHERE id = ?", [status, id], (err, result) => {
                                                  if (err) {
                                                      res.json({ err: err });
                                                  } else {
                                                      if (result) {
                                                          res.json({ message: "Role removed from user successfully!" })
                                                      } else {
                                                          res.json({ message: "Role not removed!" });
                                                      };
                                                  };
                                              });
                                          };
                                      });
                                  };
                              };
                          });
                      } else {
                          res.json({ message: "Role not removed!" });
                      };
                  });
              };
          };
      });
  });
};

// GET check if user is in a project role group
const checkGroup = (req, res) => {
  const { userTitle, username } = req.params;
  db.query(
    "SELECT * FROM user_title_user WHERE user_title = ? AND username = ?",
    [userTitle, username],
    (err, result) => {
      if (err) {
        res.json({ err: err });
      } else {
        if (result.length > 0) {
            if (result[0].status === 'assigned') {
                res.json({ isInGroup: true });
            } else {
                res.json({ isInGroup: false });
            };
        } else {
            res.json({ isInGroup: false });
        };
      };
    }
  );
};

module.exports = {
  users,
  userById,
  createUser,
  login,
  updateUserEmail,
  updateUserPassword,
  userGroups,
  userRoles,
  userTitles,
  //   getUsersUserGroups,
  updateUserInfo,
  updateUserStatus,
  getUsersGroups,
  addUserGroup,
  getUsersTitles,
  addProjectRoleToUser,
  removeProjectRoleFromUser,
  checkGroup,
};
