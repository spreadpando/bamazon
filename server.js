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

// display available products
function renderStore() {
    connection.query('SELECT * from products', function (err, result) {
        for (let i = 0; i < result.length; i++) {
            console.log(`product key: ${result[i].item_id} | ${result[i].product_name} | $${result[i].price}`)
        };
        promptSale();
    });
};

function promptSale() {
    inquire.prompt([
        { type: 'number', name: 'product_key', message: 'enter the product key you would like to order' },
        { type: 'number', name: 'quantity', message: 'what quantity would you like to order?' }
    ]).then(function (response) {
        console.log(response.product_key);
        console.log(response.quantity);
    })
}

renderStore();
