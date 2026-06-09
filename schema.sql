CREATE DATABASE IF NOT EXISTS support_tickets;
USE support_tickets;

CREATE TABLE IF NOT EXISTS tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    classification VARCHAR(100) DEFAULT 'Technical Support',
    urgency VARCHAR(50) DEFAULT 'Medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);