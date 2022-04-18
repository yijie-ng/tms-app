const db = require('../database');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { createToken } = require('../jwt');

// POST /register - Create user
const createUser = (req, res) => {
    const { firstName, lastName, username, email, password } = req.body;
    // const user = db.query("SELECT * FROM accounts WHERE username = ?", [username]);
    // if (user[0].username === username) return res.json("Username already exists!");
    bcrypt.hash(password, saltRounds).then((hash) => {
        db.query("INSERT INTO accounts (firstName, lastName, username, email, password) VALUES (?,?,?,?,?)", [firstName, lastName, username, email, hash], (err, result) => {
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
    db.query("SELECT * FROM accounts WHERE username = ?", [username], (err, results) => {
        if (err) {
            res.json({ err: err })
        } else {
            if (results.length > 0) {
                const user = results[0]
                bcrypt.compare(password, user.password, (err, result) => {
                    if (result) {
                        // req.session.user = user;
                        const accessToken = createToken(user);
                        res.cookie("access-token", accessToken, {
                            maxAge: 60 * 60 * 24 *1000,
                            httpOnly: true,
                        });
                        res.send({ message: "Login successful!" });
                    } else {
                        res.json({ message: "Invalid Password!" });
                    }
                });
            } else {
                res.json({ message: "Invalid Username!" });
            }
        }
    });
};

// GET /login - Check user login session
// const loginSession = (req, res) => {
//     if (req.session.user) {
//         res.send({ loggedIn: true, user: req.session.user })
//     } else {
//         res.send({ loggedIn: false })
//     }
// };

// PUT /user/:username - Update User by username
// const updateUser = (req, res) => {

// };

module.exports = {
    createUser,
    login
};
