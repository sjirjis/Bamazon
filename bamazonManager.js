var mysql = require('mysql'),
	inquirer = require('inquirer');

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
	promptUser();
});

var promptUser = function(){
	inquirer.prompt([{
		type: 'list',
		name: 'whatToDo',
		message: 'What would you like to do?',
		choices: 
		[
			'View Products for Sale',
			'View Low Inventory',
			'Add to Inventory',
			'Add New Product',
			'Exit'
		]
	}]).then(function(answer){
		switch (answer.whatToDo){
			case 'View Products for Sale':
				viewProductsForSale();
				break;
			case 'View Low Inventory':
				viewLowInventory();
				break;
			case 'Add to Inventory':
				addInventory();
				break;
			case 'Add New Product':
				addNewProduct();
				break;
			case 'Exit':
				connection.end();
				break;				
			default:
				console.log('How did you get here?', answer);
				break;
		}
	});
};

var viewProductsForSale = function(){
	var query = 'select * from t_products where stock_quantity > 0';
	
	connection.query(query, function(err, res){
		if (err) throw err;
		console.log();
		console.log(JSON.stringify(res, null, 2));

		console.log();
		promptUser();
	});
};

var viewLowInventory = function(){
	var query = 'select * from t_products where stock_quantity <= 5';
	
	connection.query(query, function(err, res){
		if (err) throw err;
		if (res.length === 0) {
			console.log();
			console.log('No low inventory at this time.')
		} else {
			console.log();
			console.log(JSON.stringify(res, null, 2));
		}
		console.log();
		promptUser();
	});
};

var addInventory = function(){
	inquirer.prompt([
		{
		type: 'input',
		name: 'whichItemId',
		message: 'What is the item ID you would like to add inventory to?'
		}, {
		type: 'input',
		name: 'addAmount',
		message: 'How many units would you like to add?'
		}
	]).then(function(answers){
		var addInvQuery = 'update t_products '
		+ 'set stock_quantity = stock_quantity + ' + connection.escape(answers.addAmount)
		+ 'where item_id = ' + connection.escape(answers.whichItemId) + ';'

		connection.query(addInvQuery, function(err, res){
			if (err) throw err;
			console.log();
			console.log('Added ' + answers.addAmount + ' units to item_id ' + answers.whichItemId + '.');

			var query = 'select * from t_products where item_id = '
			+ connection.escape(answers.whichItemId);

			connection.query(query, function(err, res){
				if (err) throw err;
				console.log();
				console.log(res[0]);

				console.log();
				promptUser();
			});			
		});
	});
};

var addNewProduct = function(){
	inquirer.prompt([
		{
		type: 'input',
		name: 'name',
		message: 'What is the name of the product?'
		}, {
		type: 'input',
		name: 'department',
		message: 'What department does it belong to?'
		}, {
		type: 'input',
		name: 'price',
		message: 'What is the price?'
		}, {
		type: 'input',
		name: 'stock_quantity',
		message: 'How many units?'
		}
	]).then(function(answers){
		var insertQuery = 
			'insert t_products (product_name, department_name, price, stock_quantity)'
			+ ' values (' + connection.escape(answers.name) + ", "
			+ connection.escape(answers.department) + ", "
			+ connection.escape(parseInt(answers.price)) + ", "
			+ connection.escape(parseInt(answers.stock_quantity)) + ");"

		connection.query(insertQuery, function(err, res){
			if (err) throw err;
			var selectNewItemQuery = 'select * from t_products where item_id = (select max(item_id) from t_products);'
			connection.query(selectNewItemQuery, function(err, res){
				console.log();
				console.log('Added item:', res[0]);


				console.log();
				promptUser();
			});
		});
	});
};
