const mysql = require('mysql2');

module.exports = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '7437lock',
    database: 'nodelogin'
});