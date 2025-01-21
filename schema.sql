CREATE DATABASE IF NOT EXISTS climbing_log;

USE climbing_log;

CREATE TABLE IF NOT EXISTS routes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    gym VARCHAR(255) NOT NULL,
    grade VARCHAR(50) NOT NULL,
    attempts INT NOT NULL,
    sent BOOLEAN NOT NULL,
    notes TEXT,
    image_url VARCHAR(255)
);