var mysql = require('mysql');
var inquirer = require('inquirer');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "uoft18",
    database: "bamazonDB"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    productSearch();
});

var productsforSale = [];


function productSearch() {
    inquirer
        .prompt({
            name: "productID",
            type: "input",
            message: "Please select a prodcut by product ID"
        })
        .then(function (answer) {
            console.log(answer.productID);
            con.query("SELECT * FROM bamazon WHERE ?", {
                item_id: answer.productID
            }, function (err, res) {
                console.log(
                    "Position: " +
                    res[0].item_id +
                    " || Product: " +
                    res[0].product_name +
                    " || Stock: " +
                    res[0].stock_quantity
                );
                runSearch(res);
            });
        });
}

function runSearch(ele) {
    inquirer
        .prompt({
            name: "action",
            type: "input",
            message: "How many units of the product would you like to buy?",
        })
        .then(function (answer) {
            if (parseInt(answer.action) <= ele[0].stock_quantity) {
                console.log("You have bought: " + answer.action + " items.");
                var newQuant = ele[0].stock_quantity - answer.action;
                var prevSaleTotal=ele[0].product_sales;
                var newSale = ele[0].price * answer.action;
                var newTotal=prevSaleTotal+newSale;
                var costOfPurchase=answer.action*ele[0].price;
                console.log("New stock amount: " + (newQuant));
                con.query(
                    "UPDATE bamazon SET ? WHERE ?",
                    [
                      {
                        stock_quantity: newQuant,
                        product_sales:newTotal
                      },
                      {
                        item_id: ele[0].item_id
                      }

                    ],
                    function(error) {
                      if (error) throw err;
                      console.log("Bid placed successfully!");
                      console.log("The cost of your purchase is: "+costOfPurchase);
                      console.log("Total sales is now: "+newTotal);
                      con.end();
                    }
                  );
                
            } else {
                console.log("Insufficient quantity!");
            }
        });
}