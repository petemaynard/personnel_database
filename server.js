const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
// app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
   {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: 'maynard',
      database: 'personnel_db'
   },
   console.log(`Connected to the courses_db database.`)
);



function viewAllEmployees() {
   // 
   console.log("I am going to list all employees");
   db.query(`select E.emp_id, CONCAT(E.fname, ' ', E.lname) AS full_name, R.title, D.dept_name, R.salary, CONCAT(m.fname, ' ', m.lname) AS manager
FROM employees E
INNER JOIN roles R
on E.role_id = R.role_id
inner join departments D
on R.dept_id = D.dept_id
left join employees m 
on E.manager_id = m.emp_id`, (err, results) => {
      if (err) {
         console.log(err);
      } else {
      console.log(results);
      const allEmps = results.map(employees => (
         {
            emp_id: employees.emp_id,
            full_name: employees.full_name,
            title: employees.title, 
            dept_name: employees.dept_name, 
            salary: employees.salary, 
            manager: employees.manager
         }));
         console.log("id  Name                 Title                Department           Salary     Manager");
         console.log("--  -------------------- -------------------- -------------------- ---------  -----------")
      allEmps.forEach(employee => {
         console.log(String(employee.emp_id).padEnd(3), employee.full_name.padEnd(20), employee.title.padEnd(20), employee.dept_name.padEnd(20), String(employee.salary).padEnd(10), employee.manager);
      })   
      // console.log("Showing allEmps: " + allEmps);
      return allEmps;
   }})

};

function viewAllRoles() {
   console.log("I am going to view all roles");
};

function viewAllDepartments() {
   console.log("I am going to view all departments");
};

function addEmployee() {
   console.log("I am going to add an employee");
}

function addRole() {
   console.log("I am going to add a role");
};

function addDepartment() {
   console.log("I am going to add a department");
};

function updateEmpRole() {
   console.log("I am going to update the role of an employee.");
};


viewAllEmployees();