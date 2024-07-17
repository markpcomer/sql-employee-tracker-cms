const mysql = require('mysql2');
const inquirer = require('inquirer');
require('dotenv').config();

// Creating a MySQL connection

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'employee_db'
});

// Connecting to the database
connection.connect(err => {
  if (err) throw err;
  afterConnection();
});

// Function to display the application title and initiate prompts

function afterConnection() {
  console.log("***********************************");
  console.log("*                                 *");
  console.log("*        EMPLOYEE MANAGER         *");
  console.log("*                                 *");
  console.log("***********************************");
  mainPrompts();
}

// Function to display main prompts for user actions
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
        'Update an employee',
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
      case 'Update an employee':
        updateEmployee();
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

const showDepartments = () => {
  const sql = `SELECT * FROM department`;
  connection.query(sql, (err, rows) => {
    if (err) {
      console.error('Error executing query', err);
    } else {
      console.table(rows);
    }
    mainPrompts();
  });
};

const showRoles = () => {
  const sql = `
      SELECT role.title, role.id, department.name, role.salary
      FROM role 
      LEFT JOIN department 
      ON role.department_id = department.id
  `;
  connection.query(sql, (err, rows) => {
    if (err) {
      console.error('Error executing query', err);
    } else {
      console.table(rows);
    }
    mainPrompts();
  });
};

const showEmployees = () => {

  const sql = `
      SELECT employee.id, 
          employee.first_name, 
          employee.last_name, 
          role.title, 
          department.name,
          role.salary, 
          CONCAT(manager.first_name, " ", manager.last_name) AS manager
      FROM employee
          LEFT JOIN role ON employee.role_id = role.id
          LEFT JOIN department ON role.department_id = department.id
          LEFT JOIN employee manager ON employee.manager_id = manager.id
  `;

  connection.query(sql, (err, rows) => {
    if (err) {
      console.error('Error executing query', err);
    } else {
      console.table(rows);
    }
    mainPrompts();
  });
};

function addDepartment() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Enter the new department name.'
    }
  ])
  .then(answers => {
    const sql = `INSERT INTO department (name) VALUES (?)`;
    connection.query(sql, answers.name, (err) => {
      if (err) {
        console.error('Error executing query', err);
      } else {
        console.log('Added to departments.');
      }
      showDepartments();
    });
  });
}

function addRole() {
  
  connection.query('SELECT id, name FROM department', (err, departments) => {
    if (err) {
      console.error('Error fetching departments', err);
      return;
    }

    // Prepare choices for department selection
    const departmentChoices = departments.map(department => ({
      name: department.name,
      value: department.id
    }));

    inquirer.prompt([
      {
        type: 'input',
        name: 'role',
        message: 'Please enter role title.'
      },
      {
        type: 'input',
        name: 'salary',
        message: 'Please enter the salary of the role',
      },
      {
        type: 'list',
        name: 'departmentId',
        message: 'Please select the department for the role',
        choices: departmentChoices
      }
    ])
    .then((answers) => {
      const { role, salary, departmentId } = answers;
      const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
      connection.query(sql, [role, salary, departmentId], (err) => {
        if (err) {
          console.error('Error executing query', err);
        } else {
          console.log('Role added successfully!');
          showRoles();
        }
      });
    });
  });
}


function addEmployee() {
  const roleSql = `SELECT role.id, role.title FROM role`;
  connection.query(roleSql, (err, roleData) => {
    if (err) throw err;

    const roles = roleData.map(({ id, title }) => ({ name: title, value: id }));

    const managerSql = `SELECT * FROM employee`;
    connection.query(managerSql, (err, managerData) => {
      if (err) throw err;

      const managers = managerData.map(({ id, first_name, last_name }) => ({
        name: first_name + " " + last_name,
        value: id,
      }));

      const questions = [
        {
          type: 'input',
          name: 'firstName',
          message: "What is the employee's first name?",
        },
        {
          type: 'input',
          name: 'lastName',
          message: "What is the employee's last name?",
        },
        {
          type: 'list',
          name: 'role',
          message: "What is the employee's role?",
          choices: roles,
        },
        {
          type: 'list',
          name: 'manager',
          message: "Who is the employee's manager?",
          choices: managers,
        },
      ];

      inquirer.prompt(questions).then(answer => {
        const params = [
          answer.firstName,
          answer.lastName,
          answer.role,
          answer.manager,
        ];

        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
        connection.query(sql, params, (err) => {
          if (err) {
            console.error('Error executing query', err);
          } else {
            console.log("Employee has been added!");
            showEmployees();
          }
        });
      });
    });
  });
}

function updateEmployee() {
  const employeeSql = `SELECT * FROM employee`;
  connection.query(employeeSql, (err, data) => {
    if (err) throw err;

    const employees = data.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id
    }));

    const roleSql = `SELECT * FROM role`;
    connection.query(roleSql, (err, data) => {
      if (err) throw err;

      const roles = data.map(({ id, title }) => ({
        name: title,
        value: id
      }));

      inquirer.prompt([
        {
          type: 'list',
          name: 'employee',
          message: "Which employee would you like to update?",
          choices: employees
        },
        {
          type: 'list',
          name: 'role',
          message: "What is the employee's new role?",
          choices: roles
        }
      ])
      .then(answers => {
        const params = [answers.role, answers.employee];
        const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
        connection.query(sql, params, (err) => {
          if (err) {
            console.error('Error executing query', err);
          } else {
            console.log("Employee has been updated!");
            showEmployees();
          }
        });
      });
    });
  });
}

function removeEmployee() {
  // Fetch the list of employees first
  connection.query('SELECT id, first_name, last_name FROM employee', (err, employees) => {
    if (err) {
      console.error('Error fetching employees', err);
      return;
    }

    // Prepare choices for employee selection
    const employeeChoices = employees.map(employee => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id
    }));

    inquirer.prompt([
      {
        type: 'list',
        name: 'id',
        message: 'Please select the employee you would like to remove',
        choices: employeeChoices
      }
    ])
    .then((answers) => {
      const { id } = answers;
      const sql = `DELETE FROM employee WHERE id = ?`;
      connection.query(sql, [id], (err) => {
        if (err) {
          console.error('Error executing query', err);
        } else {
          console.log('Employee removed');
        }
        showEmployees();
      });
    });
  });
}