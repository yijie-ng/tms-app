const db = require('../database');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// POST /register - Create user
const createUser = (req, res) => {
    const { firstName, lastName, username, email, password } = req.body;
    bcrypt.hash(password, saltRounds).then((hash) => {
        db.query("INSERT INTO users (firstName, lastName, username, email, password) VALUES (?,?,?,?,?)", [firstName, lastName, username, email, hash], (err, result) => {
            if (err) {
                res.status(500).json({ err: err.message })
            } else {
                res.json("SUCCESS");
            }
        });
    });
};

// POST /login - User Login
const login = (req, res) => {
    const { username, password } = req.body;
    db.query("SELECT * FROM users WHERE username = ?", [username], (err, results) => {
        if (err) {
            res.json({ err: err })
        } else {
            if (results.length > 0) {
                bcrypt.compare(password, results[0].password, (err, result) => {
                    if (result) {
                        res.json({ message: "Login successful!" });
                    } else {
                        res.status(400).json({ message: "Invalid Password" });
                    }
                });
            } else {
                res.status(400).json({ message: "Invalid Username" });
            }
        }
    });
};

// PUT /users/:username - Update User by username

module.exports = {
    createUser,
    login
};
