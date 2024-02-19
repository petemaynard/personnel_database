create database personnel_db;

use personnel_db;

CREATE TABLE `employees` (
  `emp_id` int NOT NULL AUTO_INCREMENT,
  `fname` varchar(30) NOT NULL,
  `lname` varchar(30) NOT NULL,
  `role_id` int NOT NULL,
  `manager_id` int NULL,
  PRIMARY KEY (`emp_id`),
  FOREIGN KEY (`manager_id`) REFERENCES `employees` (`emp_id`)
--  ON DELETE CASCADE 
--  ON UPDATE CASCADE
);

CREATE TABLE `departments` (
  `dept_id` int NOT NULL AUTO_INCREMENT,
  `dept_name` varchar(30) NOT NULL,
  PRIMARY KEY (`dept_id`)
--  ON DELETE CASCADE 
--  ON UPDATE CASCADE
);

CREATE TABLE `roles` (
  `role_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(30) NOT NULL,
  `dept_id` int NOT NULL,
  `salary` int NOT NULL,
  PRIMARY KEY (`role_id`),
   FOREIGN KEY (`dept_id`) REFERENCES `departments` (`dept_id`) 
--  ON DELETE CASCADE 
--  ON UPDATE CASCADE
);
