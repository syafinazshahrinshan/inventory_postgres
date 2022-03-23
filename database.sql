CREATE DATABASE inventory_database;

-- create inventory table
CREATE TABLE inventory(
    itemID SERIAL PRIMARY KEY,
    name VARCHAR(255),
    quantity INT NOT NULL,
    isAvailable boolean DEFAULT false NOT NULL,
    pricePerItem DOUBLE PRECISION NOT NULL,
    url VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
