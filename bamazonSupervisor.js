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
    inquirer.prompt([{
        type: 'list',
        name: 'viewOrCreate',
        message: 'What would you like to do?',
        choices: [
            'View Product Sales by Department',
            'Create New Department',
            'Exit'
        ]
    }]).then(function(answer) {
        switch (answer.viewOrCreate) {
            case 'View Product Sales by Department':
                viewDeptSales();
                break;
            case 'Create New Department':
				createNewDept();
                break;
            default:
                connection.end();
        }
    });
};

var viewDeptSales = function() {
    var selectQuery = 'select *,' 
    + 'total_sales - over_head_cost as total_profit ' 
    + 'from t_departments;'

    connection.query(selectQuery, function(err, res) {
        if (err) throw err;
        console.log();
        console.table(res);

        console.log();
        initialize();
    });
};

var createNewDept = function() {
    inquirer.prompt([{
        type: 'input',
        name: 'deptName',
        message: 'What is the name of the new department?'
    }, {
        type: 'input',
        name: 'overHead',
        message: 'What is the overhead of the new department?'
    }]).then(function(answers){
    	var insertNewDept = 
    		'insert t_departments (department_name, over_head_cost, total_sales) '
			+ 'values (' + connection.escape(answers.deptName) + ', '
			+ connection.escape(parseInt(answers.overHead)) + ', '
			+ parseInt(0) + ');';

		connection.query(insertNewDept, function(err, res){
			if (err) throw err;
			console.log();
			console.log('New department added!');
			viewDeptSales();
			console.log();
		})
    });
};
