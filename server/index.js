const express = require('express');
const app = express();
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3001;

app.use(cors());

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true})); 

// Generate a unique session id, store session id in a session cookie, create empty session object
app.use(session({
    secret: 'secret',
	resave: true,
	saveUninitialized: true
})); 

const db = require('./database');

// Routes
// app.get('/', (req, res) => {
//     res.json({ message: "Testing..." });
// });

app.post('/createuser', (req, res) => {
    db.query("INSERT INTO accounts (username, password, email) VALUES (?,?)", [username, password, email], (err, res) => {
        console.log(err);
    });
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    db.query(
        "SELECT * FROM accounts WHERE username = ? AND password = ?",
        [username, password],
        (err, result) => {
            if (err) {
                res.send({err: err})
            }

            if (result.length > 0) {
                res.send(result);
            } else {
                res.send({ message: "Wrong username/password combination!" });
            }
        }
    );
});

// Routers
// const usersRoute = require('./routes/users');
// app.use('/auth', usersRoute);

// app.get('/', (req, res) => {
//     res.send(200);
// });

// app.post('/login', (req, res) => {
//     console.log('hello');
//     res.send(200);
// })

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});