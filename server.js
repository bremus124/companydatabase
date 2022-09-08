const inquirer = require('inquirer');
const mysql = require('mysql2');
require('console.table');

const connection = mysql.createConnection (
    {
      host: 'localhost',
      user: 'root',
      password: 'NikoCody!23',
      database: 'company_db',
    });

const startApp = () => {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'option',
            message: 'What would you like to do?',
            choices: [
                'View All Departments',
                'View All Roles',
                'View All Employees',
                'Add Departments',
                'Add Roles',
                'Add Employee',
                'Exit',
            ],

        },

    ]).then((answer) => {
        let option = answer.option;
        switch(option){
            case 'View All Departments':
                viewDepartments();
                break;
            case 'View All Roles':
                viewRoles();
                break;
            case 'View All Employees':
                viewEmployee();
                break;
            case 'Add Departments':
                addDepartments();
                break;
            case 'Add Roles':
                addRole();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Update Employee Role':
                updateEmployee();
                break;
            default:
                exitApp();
        }
    });
}

const viewDepartments = () => {
    const dataDpt = "SELECT departments.id, departments.departments_name FROM departments;"
    connection.promise().query(dataDpt) 
    .then (([rows]) => {
        console.table(rows);
        startApp()
    }) 
        
    };

    const viewRoles = () => {
        const dataDpt = 'SELECT roles.id AS "ID", title AS "Title", salary AS "Salary", departments_name AS "Department Name" FROM roles INNER JOIN departments ON roles.departments_id=departments.id ORDER BY roles.id;'
        connection.promise().query(dataDpt) 
        .then (([rows]) => {
            console.table(rows);
            startApp()
        }) 
            
        };

     const viewEmployee = () => {
            const dataDpt = 'SELECT employee.id AS "ID", CONCAT(employee.first_name, " ", employee.last_name) AS "Employee Name",salary AS "Salary", title AS "Title", departments.departments_name AS "Department",CONCAT(manager.first_name, " ", manager.last_name) AS "Manager" FROM employee INNER JOIN roles ON employee.roles_id = roles.id INNER JOIN departments ON roles.departments_id = departments.id LEFT JOIN employee manager ON manager.id = employee.manager_id ORDER BY employee.id;'
            connection.promise().query(dataDpt) 
            .then (([rows]) => {
                console.table(rows);
                startApp()
            }) 
                
            };


const addDepartments = ()=> {
    inquirer.prompt([
        {
            type: 'input',
            message: 'Enter the name of the departments',
            name: 'departments_name'
        }
    ])
        .then(function(answer){
        connection.query("INSERT INTO departments (departments_name) VALUES (?)", [answer.departments_name] , function(err, res) {
        if (err) throw err;
        console.log(`added ${res.departments}to the database`);
        startApp()
})
})
};

function addRole() {
    inquirer
      .prompt([
        {
          type: "input",
          message: "What is the name of the role?",
          name: "roleName"
        },
        {
          type: "input",
          message: "What is the salary for this role?",
          name: "salaryTotal"
        },
        {
          type: "list",
          message: "What is the department's name?",
          name: "deptartmentsId",
          choices: ['Sales', 'Engineering', 'Finance', 'Legal']
        }
      ])
      .then(function(answer) {
  
  
        connection.query("INSERT INTO roles (title, salary, departments_id) VALUES (?, ?, ?)", [answer.roleName, answer.salaryTotal, answer.departmentsId], function(err, res) {
          if (err) throw err;
          console.table(res);
          startApp();
        });
      });
  }
  
  function addEmployee() {
    inquirer
      .prompt([
        {
          type: "input",
          message: "What is the first name of the employee?",
          name: "eFirstName"
        },
        {
          type: "input",
          message: "What is the last name of the employee?",
          name: "eLastName"
        },
        {
          type: "list",
          message: "What is the employee's role?",
          name: "rolesId",
          choices: [1,2,3,NaN]
        },
        {
          type: "list",
          message: "Who is the employee's manager?",
          name: "managerId",
          choices: [1,2,3,4,5]
          
        }
      ])
      .then(function(answer) {
  
        
        connection.query("INSERT INTO employee (first_name, last_name, roles_id, manager_id) VALUES (?, ?, ?, ?)", [answer.eFirstName, answer.eLastName, answer.rolesId, answer.managerId], function(err, res) {
          if (err) throw err;
          console.table(res);
          startApp();
        });
      });
  }
  
function updateEmployee() {
        inquirer
            .prompt([
        {
          type: "input",
          message: "Which employee would you like to update?",
          name: "eUpdate"
        },
  
        {
          type: "input",
          message: "What do you want to update to?",
          name: "updateRoles"
        }
      ])
      .then(function(answer) {
        connection.query('UPDATE employee SET roles_id=? WHERE first_name= ?',[answer.updateRoles, answer.eUpdate],function(err, res) {
          if (err) throw err;
          console.table(res);
          startApp();
        });
      });
  }
  
const exitApp = () =>{
    process.exit();
}

startApp();