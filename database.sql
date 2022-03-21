CREATE DATABASE inventory_database;

-- create inventory table
CREATE TABLE inventory(
    itemID SERIAL PRIMARY KEY,
    quantity INT NOT NULL,
    IsAvailable boolean DEFAULT false NOT NULL,
    PricePerItem DOUBLE PRECISION NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--create product image
CREATE TABLE product_image(
    product_itemID SERIAL NOT NULL,
    url TEXT NOT NULL,
    CONSTRAINT fk_itemID FOREIGN KEY(product_itemID) REFERENCES inventory(itemID)
);