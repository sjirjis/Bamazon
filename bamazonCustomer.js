var mysql = require('mysql'),
    inquirer = require('inquirer'),
    consoleTable = require('console.table');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'bamazon',
    multipleStatements: true
});

connection.connect(function(err) {
    if (err) throw err;
    initialize();
});

var initialize = function() {
    var query = 'select * from t_products where stock_quantity > 0';
    connection.query(query, function(err, res) {
        if (err) throw err;
        console.table(res);

        promptItemAndNumUnits();
    });
};

var promptItemAndNumUnits = function() {
    inquirer.prompt([{
        type: 'input',
        name: 'whichItem',
        message: 'What is the Item ID of the item you are interested in?'
    }, {
        type: 'input',
        name: 'numUnits',
        message: 'How many of this item you are interested in?'
    }]).then(function(answers) {
        inventoryCheck(answers.whichItem, answers.numUnits);
    });
};

var inventoryCheck = function(itemID, quantity) {
    var query = 
    	'select distinct 1 as inventory from t_products where exists ' 
    	+ '(select * from t_products where stock_quantity >= ' + connection.escape(quantity) 
    	+ ' and item_id = ' + connection.escape(itemID) + ');'

    connection.query(query, function(err, res) {
        if (err) throw err;
        if (res.length === 0) {
            console.log();
            console.log('Insufficient quantity!');
            console.log();
            promptAnotherPurchase();
        } else {
            orderFulfillment(itemID, quantity);
        }
    });
};

var orderFulfillment = function(itemID, quantity) {
    //
    var orderFulfillmentQuery =
        'update t_products ' 
        + 'set stock_quantity = stock_quantity - ' + connection.escape(quantity) 
        + ', product_sales = product_sales + (price * ' + connection.escape(quantity) + ') ' 
        + 'where item_id = ' + connection.escape(itemID) + '; '

	    +'update t_departments d ' 
	    + 'join t_products p on p.department_name = d.department_name ' 
	    + 'set total_sales = total_sales + (price * ' + connection.escape(quantity) + ') ' 
	    + 'where item_id = ' + connection.escape(itemID) + '; '

	    + 'select price * ' + connection.escape(quantity) + 'as price ' 
	    + 'from t_products ' 
	    + 'where item_id = ' + connection.escape(itemID) + ';'

    connection.query(orderFulfillmentQuery, function(err, res) {
        if (err) throw err;
        console.log();
        console.log('Your total price is: $' + res[2][0].price.toFixed(2));

        console.log();
        promptAnotherPurchase();
    });
};

var promptAnotherPurchase = function() {
    inquirer.prompt([{
        type: 'list',
        name: 'userChoice',
        choices: ['Yes', 'No'],
        message: 'Would you like to make another purchase?'
    }]).then(function(answer) {
        if (answer.userChoice === 'Yes') {
            initialize();
        } else {
            connection.end()
        }
    });
};

//cd /c/UCSD/repo/bamazon
