DROP DATABASE IF EXISTS bamazonDB;
CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE departments(
department_id INT PRIMARY KEY AUTO_INCREMENT,
department_name VARCHAR(100) NULL,
over_head_costs INT NOT NULL
);

INSERT INTO departments(department_name,over_head_costs)
VALUES ("Pet supplies",3000),("Outdoor supplies",5000);

CREATE TABLE bamazon(
item_id INT  PRIMARY KEY AUTO_INCREMENT,
product_name VARCHAR(100) NULL,
department_name VARCHAR(100) NULL,
price DECIMAL(10,2) NULL,
stock_quantity  INT NOT NULL,
product_sales INT NULL
);


INSERT INTO bamazon(product_name,department_name,price,stock_quantity)
VALUES ("Dog Food","Pet supplies",20.99,20);
INSERT INTO bamazon(product_name,department_name,price,stock_quantity)
VALUES ("Flashlight","Outdoor supplies",7.99,10);
INSERT INTO bamazon(product_name,department_name,price,stock_quantity)
VALUES ("Cat Food","Pet supplies",10.99,20);
INSERT INTO bamazon(product_name,department_name,price,stock_quantity)
VALUES ("Bug net","Outdoor supplies",10.99,15);
INSERT INTO bamazon(product_name,department_name,price,stock_quantity)
VALUES ("Portable bbq","Outdoor supplies",150.99,10);
INSERT INTO bamazon(product_name,department_name,price,stock_quantity)
VALUES ("Dog life jacket","Outdoor supplies",30.99,10);
INSERT INTO bamazon(product_name,department_name,price,stock_quantity)
VALUES ("Dog crate","Pet supplies",100.99,10);
INSERT INTO bamazon(product_name,department_name,price,stock_quantity)
VALUES ("Cat crate","Pet supplies",50.99,10);
INSERT INTO bamazon(product_name,department_name,price,stock_quantity)
VALUES ("Pet toys","Pet supplies",10.99,10);
INSERT INTO bamazon(product_name,department_name,price,stock_quantity)
VALUES ("Camping cooking set","Outdoor supplies",79.99,10);


SELECT departments.department_id, departments.department_name, departments.over_head_costs,SUM(product_sales) AS department_sales FROM bamazon INNER JOIN departments ON 
bamazon.department_name = departments.department_name GROUP BY departments.department_id;