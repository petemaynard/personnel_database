use personnel_db;
      
insert into departments (dept_id, dept_name)
values (1, "Sales"),
       (2, "Engineering"),
       (3, "Finance"),
       (4, "Legal");
       
insert into roles (role_id, title, dept_id, salary)
values( 1, "Sales Lead", 1, 100000),
      ( 2, "Salesperson", 1, 80000),
      ( 3, "Lead Engineer", 2, 150000),
      ( 4, "software Engineeer", 2, 120000),
      ( 5, "Account Manager", 3, 160000),
      ( 6, "Accountant", 3, 125000),
      ( 7, "Legal Team Lead", 4, 250000),
      ( 8, "Lawyer", 4, 190000);
      
insert into employees (emp_id, fname, lname, role_id, manager_id)
values (1, "John", "Doe", 1, NULL),
       (2, "Mike", "Chan", 2, 1),
       (3, "Ashley", "Rodriguez", 3, NULL),
       (4, "Kevin", "Tupik", 4, 3),
       (5, "Kunal", "Singh", 5, NULL),
       (6, "Malia", "Brown", 6, 5),
       (7, "Sarah", "Lourd", 7, NULL),
       (8, "Tom", "Allen", 8, 7);

