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
  } = req.body;
  db.query(
    "SELECT * FROM accounts WHERE username = ?",
    [username],
    (err, result) => {
      if (result.length > 0) {
        res.json({ message: "Username already taken!" });
      } else {
        db.query(
          "SELECT * FROM accounts WHERE email = ?",
          [email],
          (err, result) => {
            if (result.length > 0) {
              res.json({ message: "Email already in database!" });
            } else {
              bcrypt.hash(password, saltRounds).then((hash) => {
                db.query(
                  "INSERT INTO accounts (firstName, lastName, username, email, user_role, user_title, password) VALUES (?,?,?,?,?,?,?)",
                  [
                    firstName,
                    lastName,
                    username,
                    email,
                    userRole,
                    userTitle,
                    hash,
                  ],
                  (err, result) => {
                    if (result) {
                      userGroup.forEach((group) => {
                        db.query(
                          "INSERT INTO user_group_users (group_name, username) VALUES (?,?)",
                          [group, username],
                          (err, result) => {
                            if (err) {
                              res.json({ err: err });
                            } else {
                              if (result) {
                                res.json({
                                  message: "User created successfully!",
                                });
                              } else {
                                res.json({
                                  message:
                                    "User created but not added into user group, please try again!",
                                });
                              }
                            }
                          }
                        );
                      });
                    } else {
                      res.json({
                        message: "User not created, please try again!",
                      });
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
          bcrypt.compare(password, user.password, (err, result) => {
            if (result) {
              // req.session.user = user;
              // Attach token to user if logged in
              const accessToken = createToken(user);
              res.cookie("access-token", accessToken, {
                maxAge: 60 * 60 * 24 * 1000,
                httpOnly: true,
              });
              res.json({ id, role, accessToken, message: "Login successful!" });
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

// PUT - Admin update user details, Update User by id, should able to update email, password, disable user, user's role, title & group

// GET /user-roles - User roles
const userRoles = (req, res) => {
  db.query("SELECT * FROM user_roles", (err, result) => {
    res.json(result);
  });
};

// GET - User titles
const userTitles = (req, res) => {
  db.query("SELECT * FROM user_titles", (err, result) => {
    res.json(result);
  });
};

// GET - User groups /user-groups
const userGroups = (req, res) => {
  db.query("SELECT * FROM user_group", (err, result) => {
    res.json(result);
  });
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
};
