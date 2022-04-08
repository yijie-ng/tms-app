const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3001;

app.use(session({
    secret: 'secret',
	resave: true,
	saveUninitialized: true
})); // Generate a unique session id, store session id in a session cookie, create empty session object

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true})); // Setup the body parser to handle form submits

// Routers
const usersRoute = require('./routes/users');
app.use('/auth', usersRoute);

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