const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3001;
const helmet = require("helmet");
const xssClean = require("xss-clean");
const hpp = require("hpp");

const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const userRoute = require('./routes/User');
const authRoute = require('./routes/Authentication');
const userRolesRoute = require('./routes/UserRoles');
const userTitlesRoute = require('./routes/UserTitles');
const appRoute = require('./routes/Application');
const planRoute  = require('./routes/Plan');
const taskRoute = require('./routes/Tasks');
// const userGroupsRoute = require('./routes/UserGroup');

app.use(express.json());
app.use(cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT'],
    credentials: true
}));

// parse cookies
app.use(cookieParser());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })); 

// Generate a unique session id, store session id in a session cookie, create empty session object
app.use(session({
    key: 'username',
    secret: 'thisisasecretkey',
	resave: false,
	saveUninitialized: false,
    cookie: {
        expires: 60 * 60 * 24 // expires in 24hrs
    },
})); 

// Setup security headers
app.use(helmet());

// Prevent xss attacks
app.use(xssClean());

// Prevent HTTP Parameter Pollution attacks
app.use(hpp());

// Routes
app.use('/users', userRoute); // Update, get user(s), create user
app.use('/api/auth', authRoute); // Login, log out user
app.use('/api/user-roles', userRolesRoute); // get all user roles 
app.use('/api', userTitlesRoute); // user's user groups (project roles)
app.use('/api', appRoute);
app.use('/api', planRoute);
app.use('/api', taskRoute);

// app.use('/api', userGroupsRoute); // users' project groups

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});