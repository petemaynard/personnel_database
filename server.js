const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
// app.use(express.urlencoded({ extended: false }));
app.use(express.json());


function viewAllEmployees(){
// 
console.log("I am going to list all employees");

};

function viewAllRoles(){
   console.log("I am going to view all roles");
};

function viewAllDepartments() {
   console.log("I am going to view all departments");
};

function addEmployee(){
   console.log("I am going to add an employee");
}

function addRole(){
   console.log("I am going to add a role");
};

function addDepartment(){
     console.log("I am going to add a department");
};

function updateEmpRole(){
   console.log("I am going to update the role of an employee.");
};

