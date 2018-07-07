var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "uoft18",
    database: "bamazonDB"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    supervisorSearch();
});

function supervisorSearch() {
    inquirer
        .prompt({
            name: "supervisorOption",
            type: "rawlist",
            message: "What would you like to do?",
            choices: ["View Products Sales by Department", "Create New Department"]
        })
        .then(function (answer) {
            console.log(answer.supervisorOption);
            switch (answer.supervisorOption) {
                case "View Products Sales by Department":
                    viewDeptSale();
                    break;

                case "Create New Department":
                    createDepartment();
                    break;
            }
        });
}

// instantiate
var table = new Table({
    head: ['department_id', 'department_name','over_head_costs','product_sales','total_profit']
  , colWidths: [20, 20,20,20,20]
});

function viewDeptSale(){
    var query = "SELECT departments.department_id, departments.department_name, departments.over_head_costs,SUM(product_sales) AS department_sales ";
    query += "FROM bamazon INNER JOIN departments ON +bamazon.department_name = departments.department_name GROUP BY departments.department_id ";
    con.query(query, function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
       console.log(res);
       for(ele in res){
        var departmentCost = (res[ele].department_sales - res[ele].over_head_costs);
        table.push([res[ele].department_id, res[ele].department_name, (res[ele].over_head_costs || 0), (res[ele].department_sales || 0), (departmentCost || 0)]);
       }
       console.log(table.toString());
        con.end();
    });
    // table.push(
    //     ['First value', 'Second value']
    //   , ['First value', 'Second value']
    // );
}

function createDepartment(){
    inquirer
        .prompt([
            {
            name: "deptName",
            type: "input",
            message: "Name of department you would like to add?"
        },
        {
            name: "overHeadCostName",
            type: "input",
            message: "Which is your over head cost?"
        }
        ])
        .then(function (answer) {
            con.query(
                "INSERT INTO departments SET ?",
                {
                  department_name: answer.deptName,
                  over_head_costs: answer.overHeadCostName
                },
                function(err) {
                  if (err) throw err;
                  console.log("Your department was created successfully!");
                  con.end();
                }
              );
        });
}
