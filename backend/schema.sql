-- Placement Management System Database Schema
-- MySQL

-- Create database
CREATE DATABASE IF NOT EXISTS placement_management;
USE placement_management;

-- Students Table
CREATE TABLE IF NOT EXISTS students (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  department VARCHAR(100) NOT NULL,
  year INT NOT NULL,
  resume_link VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Coordinators Table
CREATE TABLE IF NOT EXISTS coordinators (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) DEFAULT 'Coordinator',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Companies Table
CREATE TABLE IF NOT EXISTS companies (
  id INT PRIMARY KEY AUTO_INCREMENT,
  company_name VARCHAR(255) NOT NULL,
  lpa VARCHAR(50) NOT NULL,
  role VARCHAR(255) NOT NULL,
  requirements TEXT,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES coordinators(id) ON DELETE CASCADE
);

-- Applications Table
CREATE TABLE IF NOT EXISTS applications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  company_id INT NOT NULL,
  status VARCHAR(50) DEFAULT 'Interested',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  UNIQUE KEY unique_student_company (student_id, company_id)
);

-- Insert default coordinator (email: admin@placement.com, password: admin123)
-- Note: Password should be hashed in production
INSERT INTO coordinators (email, password, name) 
VALUES ('admin@placement.com', '$2a$10$X7VYHyV5vX8KzYnGqXq1OeFqGqXq1OeFqGqXq1OeFqGqXq1OeFqGqXq', 'Admin Coordinator')
ON DUPLICATE KEY UPDATE email = email;

-- Sample data for testing (optional)

-- Sample Student (email: student@test.com, password: student123)
-- INSERT INTO students (name, email, password, department, year) 
-- VALUES ('John Doe', 'student@test.com', '$2a$10$X7VYHyV5vX8KzYnGqXq1Oe', 'Computer Science', 4);
