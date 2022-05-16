const db = require("../database");

// GET /user-roles - User roles (account type)
const userRoles = (req, res) => {
  db.query("SELECT * FROM user_roles", (err, result) => {
    res.json(result);
  });
};

// Check roles
// const checkRoles = async (username, userRole) => {
//   return new Promise((resolve, reject) => {
//     db.query("SELECT * FROM accounts WHERE username = ? AND user_role = ?", [username, userRole], (err, result) => {
//       if (err) {
//         return resolve(false);
//       } else {
//         if (result.length > 0) {

//         }
//       }
//     })
//   });
// }

module.exports = {
  userRoles,
};
