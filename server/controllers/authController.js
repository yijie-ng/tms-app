const db = require("../database");
const bcrypt = require("bcrypt");
const { createToken } = require("../jwt");
const { getAllUserTitles, checkGroup } = require("./userTitlesController");

// POST /login - User Login
const login = async (req, res) => {
    const { username, password } = req.body;
    const userTitles = await getAllUserTitles();
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
            const projectRoles = [];
            userTitles.forEach(async userTitle => {
              const inGroup = await checkGroup(user.username, userTitle.title);
              if (inGroup) {
                projectRoles.push(userTitle.title);
              };
            });
            bcrypt.compare(password, user.password, (err, result) => {
              if (result) {
                if (userStatus !== 'disabled') {
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
                    projectRoles,
                    message: "Login successful!",
                  });
                } else {
                  res.json({ message: "Your account is disabled! Please contact Administrator." });
                }
              } else {
                res.json({ message: "Invalid Username/Password!" });
              }
            });
          } else {
            res.json({ message: "Invalid Username/Password!" });
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