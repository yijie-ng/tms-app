const db = require("../database");
const bcrypt = require("bcrypt");
const saltRounds = 10;

// GET /users - All users
const users = (req, res) => {
  db.query("SELECT * FROM accounts", (err, result) => {
    res.json(result);
  });
};

// Function to get user by username
const userByUsername = async (username) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM accounts WHERE username = ?", username, (err, result) => {
      if (result.length > 0) {
        return resolve(result);
      };
    });
  });
};

// GET /users/:id - Get user by Id
const userById = async (req, res) => {
  const { id } = req.params;
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
    projectRoleStatus,
    // userGroup,
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
                          db.query(
                            "INSERT INTO user_title_user (user_title, username, status) VALUES (?,?,?)",
                            [title, username, projectRoleStatus],
                            (err, result) => {
                              if (result) {
                                db.query(
                                  "INSERT INTO user_title_user_audit (user_title, username, status) VALUES (?,?,?)",
                                  [title, username, projectRoleStatus]
                                );
                              }
                            }
                          );
                        });
                        // userGroup.forEach((group) => {
                        //   db.query(
                        //     "INSERT INTO user_group_users (group_name, username) VALUES (?,?)",
                        //     [group, username]
                        //   );
                        // });
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

// PUT - Update user email only
const updateUserEmail = (req, res) => {
  const { email } = req.body;
  const id = req.params.id;
  db.query("SELECT * FROM accounts WHERE email = ?", email, (err, result) => {
    if (result.length > 0) {
      res.json({ message: "Email already exists in database!" });
    } else {
      db.query(
        "UPDATE accounts SET email = ? WHERE id = ?",
        [email, id],
        (err, result) => {
          if (err) {
            res.json({ err: err });
          } else {
            if (result) {
              res.json({ message: "Email updated!" });
            }
          }
        }
      );
    }
  });
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
          if (result) {
            res.json({ message: "Password updated!" });
          }
        }
      }
    );
  });
};

// PUT - Admin update user details, Update User by id, should able to update email, password, disable user, user's role, title & group
const updateUserInfo = (req, res) => {
  const id = req.params.id;
  const { firstName, lastName, email, userRole, userStatus } =
    req.body;
    db.query(
      "UPDATE accounts SET firstName = ?, lastName = ?, email = ?, user_role = ?, status = ? WHERE id = ?",
      [firstName, lastName, email, userRole, userStatus, id],
      (err, result) => {
        if (err) {
          res.json({ err: err });
        } else {
          res.json({ message: "User updated!" });
        }
      }
    );
};

// PUT - update user's status
//   const updateUserStatus = (req, res) => {
//     const id = req.params.id;
//     const { status } = req.body;
//     db.query(
//       "UPDATE accounts SET status = ? WHERE id = ?",
//       [status, id],
//       (err, result) => {
//         if (err) {
//           res.json({ err: err });
//         } else {
//           res.json({ message: "Status updated!" });
//         }
//       }
//     );
//   };

module.exports = {
  users,
  userById,
  createUser,
  updateUserEmail,
  updateUserPassword,
  updateUserInfo,
  userByUsername
};
