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
});

// display available products
let products = [];
function renderStore(_callback) {
    connection.query('SELECT * from products', function (err, result) {
        console.log(`--------------------------------------------------------`);
        for (let i = 0; i < result.length; i++) {
            console.log(`product key: ${result[i].item_id} | ${result[i].product_name} | $${result[i].price} | x ${result[i].stock_quantity} in stock`)
            products.push(result[i]);
        };
        console.log(`--------------------------------------------------------`);
        _callback();
    });
};

function promptChoice() {
    inquire.prompt([
        { type: 'list', name: 'choice', message: 'which action would you like to take next?', choices: ['view/shop products', 'sell a product'] }
    ]).then(function (response) {
        let reply = response.choice;
        switch (reply) {
            case 'view/shop products':
                renderStore(promptSale);
                break;
            case 'sell a product':
                createProduct();
                break;
        }
    })
}

function createProduct() {
    inquire.prompt([{
        type: 'input',
        name: 'name',
        message: 'what is the name of your product?',
    },
    {
        type: 'list',
        name: 'dept',
        message: 'in which department would you like your item to be listed?',
        choices: ['toys', 'games', 'electronics', 'books', 'kitchen', 'bathroom', 'consumable']
    },
    {
        type: 'input',
        name: 'price',
        message: 'what price would you like to set? (in $USD)'
    },
    {
        type: 'number',
        name: 'quant',
        message: 'how many products do you have in stock ready to ship?'
    }]).then(function (rsp) {
        let query = 'INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("' + rsp.name + '", "' + rsp.dept + '", "' + parseFloat(rsp.price) + '", "' + rsp.quant + '")';
        connection.query(query, function (err, result) {
            if (err) {
                throw err;
            }
            console.log(`
            1 product inserted
            `);
            promptChoice();
        })
    })
}

function promptSale() {
    inquire.prompt([
        { type: 'number', name: 'product_key', message: '\n enter the product key you would like to order' },
        { type: 'number', name: 'quantity', message: 'what quantity would you like to order?' }
    ]).then(function (response) {
        let pkey = response.product_key;
        let quantity = response.quantity;
        let found = false;
        let ordered = false;
        for (let i = 0; i < products.length; i++) {
            // check which product is selected
            if (products[i].item_id === pkey) {
                found = true;
                if (products[i].stock_quantity > quantity) {
                    //place order if available
                    let set = products[i].stock_quantity - quantity;
                    let where = 'item_id = ' + products[i].item_id;
                    let query = 'UPDATE products SET stock_quantity = ' + set + ' WHERE ' + where;
                    connection.query(query, function (err, result) {
                        if (err) {
                            throw err;
                        }
                        ordered = true;
                        if (found === false) {
                            console.log(':::::  that product key did not match any products  :::::');
                            promptSale();
                        }
                        if (found == true && ordered == false) {
                            console.log(':::::  out of stock  :::::');
                            promptSale();
                        }
                        if (found && ordered) {
                            console.log(`
                                        your order of :
                                        ${quantity} ${products[i].product_name}(s) 
                                        has been completed
                                        `);
                            promptChoice();
                        }
                    })
                }
            }

        }




    })
}


promptChoice();