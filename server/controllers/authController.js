const db = require("../database");
const bcrypt = require("bcrypt");
const { createToken } = require("../jwt");

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

const logout = (req, res) => {
  res.clearCookie("access-token", {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 1000
  });
  res.sendStatus(204);
};

  module.exports = {
      login,
      logout
  }