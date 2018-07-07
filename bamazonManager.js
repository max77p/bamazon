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
    managerSearch();
});

function managerSearch() {
    inquirer
        .prompt({
            name: "managerOption",
            type: "rawlist",
            message: "What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        })
        .then(function (answer) {
            console.log(answer.managerOption);
            switch (answer.managerOption) {
                case "View Products for Sale":
                    viewSale();
                    break;

                case "View Low Inventory":
                    viewLowInventory();
                    break;

                case "Add to Inventory":
                    addToInventory();
                    break;

                case "Add New Product":
                    addProduct();
                    break;
            }
        });
}

var tableSale = new Table({
    head: ['item_id', 'product_name','department_name','price','quantity_available']
  , colWidths: [20,20,20,20,20]
});

function viewSale() {
    con.query("SELECT * FROM bamazon", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        // console.log(res);
        for(ele in res){
            tableSale.push([res[ele].item_id, res[ele].product_name, res[ele].department_name, (res[ele].price || 0), (res[ele].stock_quantity || 0)]);
           }
           console.log(tableSale.toString());
        con.end();
    });
}

function viewLowInventory() {
    con.query("SELECT * FROM bamazon WHERE stock_quantity < 5", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        if (res.length < 1) {
            console.log("No low inventory to display")
        } else {
            for(ele in res){
                tableSale.push([res[ele].item_id, res[ele].product_name, res[ele].department_name, (res[ele].price || 0), (res[ele].stock_quantity || 0)]);
               }
               console.log(tableSale.toString());
        }
        con.end();
    });
}

function addToInventory() {
    con.query("SELECT * FROM bamazon", function (err, res) {
        inquirer
            .prompt([
                {
                    name: "selectInventory",
                    type: "rawlist",
                    choices: function () {
                        var choiceArr = [];
                        for (ele in res) {
                            choiceArr.push(res[ele].product_name);
                        }
                        return choiceArr;
                    },
                    message: "Which inventory would you like to add to?"
                },
                {
                    name: "addInventory",
                    type: "input",
                    message: "How much would you like to add to inventory?"
                }
            ])
            .then(function (answer) {
                
                var chosen;
                for (var i = 0; i < res.length; i++) {
                    if (answer.selectInventory === res[i].product_name) {
                        chosen = res[i];
                    }
                }
                if (answer.addInventory) {
                    var newStock=chosen.stock_quantity+(parseInt(answer.addInventory));
                    // console.log(chosen.stock_quantity);
                    // console.log(answer.addInventory);
                    // console.log(newStock);
                    con.query(
                        "UPDATE bamazon SET ? WHERE ?", [{
                                stock_quantity: newStock
                            },
                            {
                                item_id: chosen.item_id
                            }
                        ],
                        function (error) {
                            if (error) throw err;
                            console.log("Stock replenished!");
                            console.log("The new stock amount is: " + newStock);
                            con.end();
                        }
                    );
                }

            });
    });
}

function addProduct(){
    inquirer
        .prompt([
            {
            name: "prodName",
            type: "input",
            message: "Name of product you would like to add?"
        },
        {
            name: "departName",
            type: "input",
            message: "Which department does it belong to?"
        },
        {
            name: "prodPrice",
            type: "input",
            message: "What is the unit price?"
        },
        {
            name: "prodStock",
            type: "input",
            message: "How much initial stock do you want to add?"
        }
        ])
        .then(function (answer) {
            con.query(
                "INSERT INTO bamazon SET ?",
                {
                  product_name: answer.prodName,
                  department_name: answer.departName,
                  price: answer.prodPrice,
                  stock_quantity: answer.prodStock
                },
                function(err) {
                  if (err) throw err;
                  console.log("Your product was created successfully!");
                  con.end();
                }
              );
        });
}