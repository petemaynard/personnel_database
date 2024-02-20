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
         console.log("\n");
         console.log("id  Name                 Title                Department           Salary     Manager");
         console.log("--  -------------------- -------------------- -------------------- ---------  -----------")
         allEmps.forEach(employee => {
            console.log(String(employee.emp_id).padEnd(3), employee.full_name.padEnd(20), employee.title.padEnd(20), employee.dept_name.padEnd(20), String(employee.salary).padEnd(10), employee.manager);
         })
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
         console.log("id  Title                Department           Salary");
         console.log("--  -------------------  -------------------  --------");
         allRoles.forEach(role => {
            console.log(String(role.role_id).padEnd(3), role.title.padEnd(20), role.dept_name.padEnd(20), String(role.salary).padEnd(10));
         })
         startingMenu();
      }
   })
};

function viewAllDepartments() {

   console.log("I am going to view all departments");
   db.query(`select dept_id, dept_name from Departments order by dept_id`, (err, results) => {
      if (err) {
         console.log(err);
      } else {
         const allDepts = results.map(depts => (
            {
               dept_id: depts.dept_id,
               dept_name: depts.dept_name
            }))
         console.log("id  Department");
         console.log("--  ------------------");
         allDepts.forEach(dept => {
            console.log(String(dept.dept_id).padEnd(3), dept.dept_name.padEnd(20));
         })
         startingMenu();
      };
   })
};

function viewOnlyRoles() {
   console.log("I have started the viewOnlyRoles function")
   // Get list of employee roles
   const roleList = db.query(`SELECT role_id, title FROM roles order by role_id`, (err, results) => {
      if (err) {
         console.log(err);
      } else {
         const allRoles = results.map(roles => (
            {
               role_id: roles.role_id,
               title: roles.title
            }))

         // Build roles into an array that can be used in the inquirer prompt below
         const roleArray = [];
         allRoles.forEach(role => roleArray.push(role.title));
         console.log("roleArray is " + roleArray);

         inquirer.prompt(
            {
               type: 'list',
               message: 'What is the employee\'s role?',
               name: 'role',
               choices: roleArray
            }
         )
            .then((response) => {
               console.log("response.role is " + response.role);
               return response.role;
            })
         // Do not return to main menu!!
      };
   });

}

function viewOnlyManagers() {
   console.log("I have started the viewOnlyManagers function");
   // Get list of managers (we are assuming here that any employee can be a manager)
   const managerList = db.query(`SELECT emp_id, CONCAT(E.fname, ' ', E.lname) AS full_name`, (err, results) => {
      if (err) {
         console.log(err);
      } else {
         const allManagers = results.map(managers => (
            {
               value: managers.emp_id,
               name: managers.full_name
            }
         ))
         const managerArray = [];
         allManagers.forEach(manager => managerArray.push(manager.name));
         console.log("managerArray is " + managerArray);

         inquirer.prompt(
            {
               type: 'list',
               message: "Who is the employee's manager?",
               name: 'manager',
               choices: managerArray
            }
         )
            .then((response) => {
               console.log("response.manager is " + response.manager);
               return response.manager;
            })
         // Do not return to main menu!!
      }
   })
};

function viewOnlyEmployees() {
   // Get a list of employees (this is exactly the same query the viewOnlyManagers function uses)
   const managerList = db.query(`SELECT emp_id, CONCAT(E.fname, ' ', E.lname) AS full_name`, (err, results) => {
      if (err) {
         console.log(err);
      } else {
         const allEmployees = results.map(employees => (
            {
               value: employees.emp_id,
               name: employees.full_name
            }
         ))
         const employeeArray = [];
         allEmployees.forEach(employee => employeeArray.push(employee.name));
         console.log("employeeArray is " + employeeArray);

         inquirer.prompt(
            {
               type: 'list',
               message: "Which employee's role do you want to update?",
               name: 'employee',
               choices: employeeArray
            }
         )
            .then((response) => {
               console.log("response.employee is " + response.employee);
               return response.employee;
            })
         // Do not return to main menu!!
      }
   })
};

function viewOnlyDepartments() {
   // Get a list of departments)
   const departmentList = db.query(`SELECT dept_id, dept_name from departments`, (err, results) => {
      if (err) {
         console.log(err);
      } else {
         const allDepartments = results.map(departments => (
            {
               value: departments.dept_id,
               name: departments.dept_name
            }
         ))
         const departmentArray = [];
         allDepartments.forEach(department => departmentArray.push(department.name));
         console.log("departmentArray is " + departmentArray);

         inquirer.prompt(
            {
               type: 'list',
               message: "What department does the role belong to?",
               name: 'department',
               choices: departmentArray
            }
         )
            .then((response) => {
               console.log("response.department is " + response.department);
               return response.department;
            })
         // Do not return to main menu!!
      }
   })

};

function addEmployee() {
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
         const fname = response.fname;
         const lname = response.lname
         console.log("The new employe name is " + fname + " " + lname);
         viewOnlyRoles();
         viewOnlyManagers();
         // Insert to the employee table

         startingMenu();
      });
}

function addRole() {
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
         name: 'roleSalary'
      },
   ])
   viewOnlyDepartments();

   // Insert to the Roles table

   startingMenu();
};

function addDepartment() {
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



startingMenu();