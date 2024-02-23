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

let departmentID;
let managerID;
let roleID;
let employeeID;
let fname;
let lname;
let roleName;
let roleSalary;


function viewAllEmployees() {
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
         const allEmps = results.map(employees => (
            {
               emp_id: employees.emp_id,
               full_name: employees.full_name,
               title: employees.title,
               dept_name: employees.dept_name,
               salary: employees.salary,
               manager: employees.manager
            }));
         console.table(allEmps)
         startingMenu()
      }
   })
};

function viewAllRoles() {
   db.query(`select R.role_id, R.title, D.dept_name, R.salary
   from roles R
   inner join departments D
   on R.dept_id = D.dept_id;`, (err, results) => {
      if (err) {
         console.log(err);
      } else {
         const allRoles = results.map(roles => (
            {
               role_id: roles.role_id,
               title: roles.title,
               dept_name: roles.dept_name,
               salary: roles.salary
            }));
         console.table(allRoles);
         startingMenu();
      }
   })
};

function viewAllDepartments() {
   db.query(`SELECT dept_id, dept_name FROM Departments ORDER BY dept_id`, (err, results) => {
      if (err) {
         console.log(err);
      } else {
         const allDepts = results.map(depts => (
            {
               dept_id: depts.dept_id,
               dept_name: depts.dept_name
            }))
         console.table(allDepts);
         startingMenu();
      };
   })
};

function viewOnlyRoles() {
   return new Promise((resolve, reject) => {
      db.query(`SELECT role_id, title FROM roles ORDER BY role_id`, (err, results) => {
         if (err) {
            console.log(err);
         } else {
            const allRoles = results.map(roles => (
               {
                  value: roles.role_id,
                  name: roles.title
               }));
            inquirer.prompt(
               {
                  type: 'list',
                  message: 'What is the employee\'s role?',
                  name: 'role',
                  choices: allRoles
               }
            )
               .then((response) => {
                  roleID = response.role;
                  resolve(roleID);
               })
               .catch(err => reject(err))
            // Do not return to main menu!!
         }
      })
   })
};

function viewOnlyManagers() {
   // Get list of managers (we are assuming here that any employee can be a manager)
   return new Promise((resolve, reject) => {
      db.query(`SELECT emp_id, CONCAT(fname, ' ', lname) AS full_name from employees`, (err, results) => {
         if (err) {
            console.log(err);
         } else {
            const allManagers = results.map(managers => (
               {
                  value: managers.emp_id,
                  name: managers.full_name
               }
            ))
            inquirer.prompt(
               {
                  type: 'list',
                  message: "Who is the employee's manager?",
                  name: 'manager',
                  choices: allManagers
               }
            )
               .then((response) => {
                  managerID = response.manager;
                  resolve(managerID);
               }).catch(reject);
            // Do not return to main menu!!
         }
      });
   });
}

function viewOnlyEmployees() {
   // Get a list of employees (this is exactly the same query the viewOnlyManagers function uses)
   return new Promise((resolve, reject) => {
      db.query(`SELECT emp_id, CONCAT(fname, ' ', lname) AS full_name FROM employees`, (err, results) => {
         if (err) {
            console.log(err);
         } else {
            const allEmployees = results.map(employees => (
               {
                  value: employees.emp_id,
                  name: employees.full_name
               }
            ))

            inquirer.prompt(
               {
                  type: 'list',
                  message: "Which employee's role do you want to update?",
                  name: 'employee',
                  choices: allEmployees
               }
            )
               .then((response) => {
                  employeeID = response.employee
                  resolve(employeeID);
               }).catch(reject);
            // Do not return to main menu!!
         }
      })
   });
}

function viewOnlyDepartments() {
   // Get a list of departments)
   return new Promise((resolve, reject) => {
      db.query(`SELECT dept_id, dept_name from departments`, (err, results) => {
         if (err) {
            console.log(err);
         } else {
            const allDepartments = results.map(departments => (
               {
                  value: departments.dept_id,
                  name: departments.dept_name
               }
            ))
            inquirer.prompt(
               {
                  type: 'list',
                  message: "What department does the role belong to?",
                  name: 'department',
                  choices: allDepartments
               }
            )
               .then((response) => {
                  departmentID = response.department;
                  resolve(departmentID);
               }).catch(reject);
            // Do not return to main menu!!
         }
      })
   });
}

async function addEmployee() {
   inquirer.prompt([
      {
         type: 'input',
         name: 'fname',
         message: 'What is the first name?',
      },
      {
         type: 'input',
         name: 'lname',
         message: 'What is the last name?',
      },
   ])
      .then((response) => {
         fname = response.fname;
         lname = response.lname;
      })
      .then(() => {
         viewOnlyRoles()
            .then(() => {
               viewOnlyManagers()
                  .then(() => {     // Used to have managerName in the parentheses
                     insertFields = `fname, lname, role_id, manager_id`;
                     insertValues = `"${fname}", "${lname}", ${roleID}, ${managerID} `
                     // Insert to the employee table
                     insertRecord("employees", insertFields, insertValues)
                  })
            })
      })
};

async function addRole() {
   inquirer.prompt([
      {
         type: 'input',
         message: 'What is the name of the role?',
         name: 'nameOfRole',
      },
      {
         type: 'input',
         message: 'What is the salary of the role?',
         name: 'salaryAmt'
      },
   ])
      .then((response) => {
         roleName = response.nameOfRole;
         roleSalary = response.salaryAmt;
      })
      .then(() => {
         viewOnlyDepartments()
            .then(() => {
               // Insert to the Roles table
               insertFields = `title, dept_id, salary`;
               insertValues = `"${roleName}", ${departmentID}, ${roleSalary}`
               insertRecord("roles", insertFields, insertValues);
            })
      })
};

function addDepartment() {
   inquirer.prompt(
      {
         type: 'input',
         message: 'What is the name of the department?',
         name: 'nameOfDept',
      }
   )
   .then((response) => {
      insertRecord("departments", "dept_name", `"${response.nameOfDept}"`)
   })
};

async function updateEmployeeRole() {
   viewOnlyEmployees()
      .then(() => {
         viewOnlyRoles()
            .then(() => {
               updateRecord("employees", "role_id", roleID, "emp_id", employeeID) 
            })
      })
};

function insertRecord(table, fields, values) {
   db.query(`INSERT INTO ${table} (${fields}) VALUES (${values})`, (err, result) => {
      if (err) {
         console.log(err)
      }
   });
   startingMenu()
}

function updateRecord(table, field1, value1, field2, value2) {
   db.query(`UPDATE ${table} SET ${field1} = ${value1} WHERE ${field2} = ${value2}`, (err, result) => {
      if (err) {
         console.log(err)
      }
   })
   startingMenu()
}

function startingMenu() {

   // This will have the initial inquire statement with options of what to do
   inquirer.prompt(
      {
         type: 'list',
         message: 'What would you like to do?',
         name: 'menu',
         choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit']
      }
   )
      .then((response) => {
         switch (response.menu) {
            case 'View All Employees':
               console.log("I want to " + response.menu);
               viewAllEmployees();
               break;
            case 'Add Employee':
               console.log("I want to " + response.menu);
               addEmployee();
               break;
            case 'Update Employee Role':
               console.log("I want to " + response.menu);
               updateEmployeeRole();
               break;
            case 'View All Roles':
               console.log("I want to " + response.menu);
               viewAllRoles();
               break;
            case 'Add Role':
               console.log("I want to " + response.menu);
               addRole();
               break;
            case 'View All Departments':
               console.log("I want to " + response.menu);
               viewAllDepartments();
               break;
            case 'Add Department':
               console.log("I want to " + response.menu);
               addDepartment();
               break;
            case 'Quit':
               process.exit(0);
            default:
               console.log("I want to " + response.menu);
               console.log("There is no such choice!");
               break;
         }
      })
};

// Here we go!
startingMenu();
