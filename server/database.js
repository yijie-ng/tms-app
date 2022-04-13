const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

module.exports = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.MYSQL_PASSWORD,
    database: 'tmsapp',
    // dialect: 'mysql2'
    // pool: {
    //     max: 5,
    //     min: 0,
    //     acquire: 30000,
    //     idle: 10000 }
});