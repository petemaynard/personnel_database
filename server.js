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

let departmentName;
let managerName;
let roleID;
let fname;
let lname;


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

   console.log("I am going to view all departments");
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
                  console.log("response.employee is " + response.employee);
                  employeeName = response.employee
                  resolve(employeeName);
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
            // const departmentArray = [];
            // allDepartments.forEach(department => departmentArray.push(department.name));
            // console.log("departmentArray is " + departmentArray);

            inquirer.prompt(
               {
                  type: 'list',
                  message: "What department does the role belong to?",
                  name: 'department',
                  choices: allDepartments
               }
            )
               .then((response) => {
                  console.log("response.department is " + response.department);
                  departmentName = response.department;
                  resolve(departmentName);
               }).catch(reject);
            // Do not return to main menu!!
         }
      })
   });
}

async function addEmployee() {
   console.log("I am going to add an employee");

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
            // console.log("The role name is " + roleName)
            .then(() => {
               viewOnlyManagers()
                  // console.log("The manager name is " + managerName)
                  .then((managerName) => {
                     console.log("The new employee name is " + fname + " " + lname)
                     console.log("The role is " + roleID)
                     console.log("The manager name is " + managerID)
                     insertFields = `fname, lname, role_id, manager_id`;
                     insertValues = `"${fname}", "${lname}", ${roleID}, ${managerID} `
                     // Insert to the employee table
                     insertRecord("employees", insertFields, insertValues)
                     // startingMenu()
                  })
            })
      })
};

async function addRole() {
   console.log("I am going to add a role");

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
      .then((reponse) => {
         const roleName = response.nameOfRole;
         const roleSalary = reponse.salaryAmt;
      })
      .then(() => {
         viewOnlyDepartments()
         console.log("The department name is " + deptName)
            .then((whatIsThis) => {
               // Insert to the Roles table

               startingMenu()
            })
      })
};

async function addDepartment() {
   console.log("I am going to add a department");


   startingMenu();
};

function updateEmployeeRole() {
   console.log("I am going to update the role of an employee.");

   viewOnlyEmployees();
   viewOnlyRoles();

   // Update the employee table

   startingMenu();
};

 function insertRecord(table, fields, values) {
   console.log(`INSERT INTO ${table} (${fields}) VALUES (${values})`);
   db.query(`INSERT INTO ${table} (${fields}) VALUES (${values})`, (err, result) => {
      if (err) {
         console.log(err)
      }
   });
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



// startingMenu();
addEmployee();