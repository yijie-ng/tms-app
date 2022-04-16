const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3001;

const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const userRoute = require('./routes/User');
const authRoute = require('./routes/Authentication');

app.use(express.json());
app.use(cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST'],
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

// Routes
app.use('/user', userRoute);
app.use('/login', authRoute);
// app.use('/', routes);
// Login
// app.use('/login', routes);
// create user
// app.use('/register', routes);
// Update user

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});