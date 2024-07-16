const mysql = require('mysql2');

const inquirer = require('inquirer');

const cTable = require('console.table'); 

require('dotenv').config()
// const { Pool } = require('pg');

// const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   password: "LifeIsV3ryGood",
//   database: "employee_db",
//   port: 5432,
// });

// pool.connect()
//   .then(() => console.log("Connected to database"))
//   .catch(err => console.error('Error connecting to database'));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'employee_db'
});

connection.connect(err => {
  if(err) throw err;
  console.log('connected as id ' + connection.threadId);
  afterConnection();
});

afterConnection = () => {
  console.log("***********************************")
  console.log("*                                 *")
  console.log("*        EMPLOYEE MANAGER         *")
  console.log("*                                 *")
  console.log("***********************************")
  mainPrompts();
};


const mainPrompts = () => {
  inquirer.prompt([
    {
      type: 'list',
      name: 'choices',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Remove an employee',
      ]
    }
  ])
  .then((answers) => {
    const { choices } = answers;

    switch (choices) {
      case 'View all departments':
        showDepartments();
        break;
      case 'View all roles':
        showRoles();
        break;
      case 'View all employees':
        showEmployees();
        break;
      case 'Add a department':
        addDepartment();
        break;
      case 'Add a role':
        addRole();
        break;
      case 'Add an employee':
        addEmployee();
        break;
      case 'Remove an employee':
        removeEmployee();
        break;
      default:
        console.log('Invalid choice');
        break;
    }
  });
};

const showDepartments = async () => {
  console.log('Showing all departments...\n');
  const sql = `SELECT * FROM department`;

  try {
    const [rows] = await connection.promise().query(sql);
    console.table(rows);
    mainPrompts(); 
  } catch (err) {
    console.error('Error executing query', err);
  }
};


// function showDepartments() {
//   console.log('Showing all departments...\n');
//   const sql = `SELECT * FROM department`;

//   connection.promise().query(sql)
//     .then((res) => {
//       console.table(res.rows);
//       mainPrompts();
//     })
//     .catch(err => console.error('Error executing query', err.stack));
// }

// showDepartments = () => {
//   console.log('Showing all departments...\n');
//   const sql = `SELECT department.id AS id, department.name AS department FROM department`; 

//   connection.promise().query(sql, (err, rows) => {
//     if (err) throw err;
//     console.table(rows);
//     mainPrompts();
//   });
// };

function showRoles() {
  console.log('Showing all roles...\n');
  const sql = `SELECT * FROM role`;

  connection.promise().query(sql)
    .then((res) => {
      console.table(res.rows);
      mainPrompts();
    })
    .catch(err => console.error('Error executing query', err.stack));
}

function showEmployees() {
  console.log('Showing all employees...\n');
  const sql = `SELECT * FROM employee`;

  connection.promise().query(sql)
    .then((res) => {
      console.table(res.rows);
      mainPrompts();
    })
    .catch(err => console.error('Error executing query', err.stack));
}

function addDepartment() {
  console.log('Adding a department...\n');

  inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Enter the department name.'
    }
  ])
  .then((answers) => {
    const { name } = answers;
    const sql = `INSERT INTO department (name) VALUES ($1) RETURNING *`;
    const params = [name];

    connection.promise().query(sql, params)
      .then(() => {
        console.log('Department added successfully!');
        mainPrompts();
      })
      .catch(err => console.error('Error executing query', err.stack));
  })
}

function addRole() {
  console.log('Adding a role...\n');

  inquirer.prompt([
    {
      type: 'input',
      name: 'jobTitle',
      message: 'Please enter role title.'
    },
    {
      type: 'input',
      name: 'salary',
      message: 'Please enter the salary of the role',
    },
    {
      type: 'input',
      name: 'departmentId',
      message: 'Please enter the department id of the role'
    }
  ])
  .then((answers) => {
    const { jobTitle, salary, departmentId } = answers;
    const sql = `INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)`;
    const params = [jobTitle, salary, departmentId];

    connection.promise().query(sql, params)
      .then(() => {
        console.log('Role added');
        mainPrompts();
      })
      .catch(err => console.error('Error executing query', err.stack));
  })
}

function addEmployee() {
  console.log('Adding an employee...\n');

  inquirer.prompt([
    {
      type: 'input',
      name: 'firstname',
      message: 'Please enter the first name of the employee',
    },
    {
      type: 'input',
      name: 'lastname',
      message: 'Please enter the last name of the employee.'
    },
    {
        type: 'input',
        name: 'roleId',
        message: 'Please enter the role id'
    }
  ])
  .then((answers) => {
    const { firstname, lastname } = answers;
    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)`;
    const params = [firstname, lastname];

    connection.promise().query(sql, params)
      .then(() => {
        console.log('Employee added');
        mainPrompts();
      })
      .catch(err => console.error('Error executing query', err.stack));
  })
}

function removeEmployee() {
  console.log('Removing an employee...\n');
  inquirer.prompt([
    {
      type: 'input',
      name: 'id',
      message: 'Please enter the id of the employee you would like to remove'
    }
  ])
  .then((answers) => {
    const { id } = answers;
    const sql = `DELETE FROM employee WHERE id = $1`;
    const params = [id];

    connection.promise().query(sql, params)
      .then(() => {
        console.log('Employee removed');
        mainPrompts();
      })
      .catch(err => console.error('Error executing query', err.stack));
  })
}

mainPrompts();


