const db = require("../database");

// GET - User titles (user groups)
const userTitles = (req, res) => {
  db.query("SELECT * FROM user_titles", (err, result) => {
    res.json(result);
  });
};

// GET - all users' user titles (user groups)
const getUsersTitles = (req, res) => {
  db.query("SELECT * FROM user_title_user", (err, result) => {
    res.json(result);
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
                  db.query(
                    "INSERT INTO user_title_user_audit (user_title, username, status) VALUES (?,?,?)",
                    [title, username, status],
                    (err, result) => {
                      if (err) {
                        res.json({ err: err });
                      } else {
                        if (result) {
                          res.json({
                            message: "New roles assigned to user successfully!",
                          });
                        } else {
                          res.json({
                            message: "New roles not added into audit!",
                          });
                        }
                      }
                    }
                  );
                } else {
                  res.json({ message: "New roles not added!" });
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
                    db.query(
                      "INSERT INTO user_title_user_audit (user_title, username, status) VALUES (?,?,?)",
                      [title, username, status],
                      (err, result) => {
                        if (err) {
                          res.json({ err: err });
                        } else {
                          if (result) {
                            res.json({
                              message:
                                "New roles assigned to user successfully!",
                            });
                          } else {
                            res.json({
                              message: "New roles not added into audit!",
                            });
                          }
                        }
                      }
                    );
                  } else {
                    res.json({ message: "New roles not added!" });
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
                                          "Role removed from user successfully!",
                                      });
                                    } else {
                                      res.json({
                                        message: "Role not removed!",
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
                  res.json({ message: "Role not removed!" });
                }
              }
            );
          }
        }
      }
    );
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
          if (result[0].status === "assigned") {
            res.json({ isInGroup: true });
          } else {
            res.json({ isInGroup: false });
          }
        } else {
          res.json({ isInGroup: false });
        }
      }
    }
  );
};

module.exports = {
  userTitles,
  getUsersTitles,
  addProjectRoleToUser,
  removeProjectRoleFromUser,
  checkGroup,
};
