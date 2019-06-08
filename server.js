const sql = require('mysql');
const inquire = require('inquirer');
require('dotenv').config();


const connection = sql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.DB_PW,
    database: "bamazon_db"
});

// Initiate MySQL Connection.
connection.connect(function (err) {
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
    }
    console.log("connected as id " + connection.threadId);
});