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
let products = [];
function renderStore() {
    connection.query('SELECT * from products', function (err, result) {
        for (let i = 0; i < result.length; i++) {
            console.log(`product key: ${result[i].item_id} | ${result[i].product_name} | $${result[i].price}`)
            products.push(result[i]);
        };

    });
};

function promptSale() {
    inquire.prompt([
        { type: 'number', name: 'product_key', message: 'enter the product key you would like to order' },
        { type: 'number', name: 'quantity', message: 'what quantity would you like to order?' }
    ]).then(function (response) {
        let pkey = response.product_key;
        let quantity = response.quantity;
        let found = false;
        console.log(products);
        for (let i = 0; i < products.length; i++) {
            // check which product is selected
            if (products[i].item_id === pkey) {
                found = true;
                if (products[i].stock_quantity > quantity) {
                    //place order
                    let set = products[i].stock_quantity - quantity;
                    let where = 'item_id = ' + products[i].item_id;
                    let query = 'UPDATE products SET stock_quantity = ' + set + ' WHERE ' + where;
                    connection.query(query, function (err, result) {
                        if (err) {
                            throw err;
                        }
                        renderStore();
                    })
                } else {
                    console.log(':::::  out of stock  :::::');
                }
            }

        }
        if (found === false) {
            console.log(':::::  that product key did not match any products  :::::');
        }



    })
}

renderStore();
promptSale();