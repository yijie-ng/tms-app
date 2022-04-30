const db = require("../database");

// GET /user-roles - User roles (account type)
const userRoles = (req, res) => {
    db.query("SELECT * FROM user_roles", (err, result) => {
      res.json(result);
    });
  };

module.exports = {
    userRoles
}