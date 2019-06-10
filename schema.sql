-- Create and use this database
CREATE DATABASE bamazon_db;
USE bamazon_db;

-- Creating table of products
CREATE TABLE products
(
  item_id INT
  AUTO_INCREMENT,
  product_name VARCHAR
  (30) NOT NULL,
  department_name VARCHAR
  (30),
  price FLOAT
  (20),
    stock_quantity INT
  (30),
  PRIMARY KEY
  (id)
);

  -- Inserted a set of records into the table
  INSERT INTO products
  VALUES
    (0, "fidget spinner", "toys", 5.25, 300);
 