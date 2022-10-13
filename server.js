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
                'Update Employee Role',
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
            message: 'Enter the name of the department',
            name: 'departments_name'
        }
    ])
        .then(function(answer){
        connection.query("INSERT INTO departments (departments_name) VALUES (?)", [answer.departments_name] , function(err, res) {
        if (err) throw err;
        console.log(`added ${answer.departments_name} to the database`);
        startApp()
})
})
};

const addRole = () => {
  const departments = [];
  connection.promise().query("SELECT departments.departments_name FROM departments;")
  .then (([rows]) => {
  for (row of rows){
    departments.push(row.departments_name)
  }
    inquirer.prompt([
        {
          type: "input",
          name: "title",
          message: "What is the name of the role?",
        },
        {
          type: "input",
          name: "salary",
          message: "What is the salary for this role?",
        },
        {
          type: "list",
          name: "departments_id",
          message: "What is the department's name?",
          choices: departments,
        }
      ])
      .then((data) => {
        const title = data.title;
        const salary = data.salary;
        let departments_id;
        connection.promise().query(`SELECT id FROM departments WHERE departments_name = "${data.departments_id}";`)
        .then(([rows])=> {
          console.log(rows[0].id);
          departments_id = rows[0].id;
          connection.promise().execute("INSERT INTO roles (title, salary, departments_id) VALUES (?, ?, ?)", [title,salary, departments_id])
          .then (() => {
            startApp();
          })
                    
        })
      });
    });
  }
  
const addEmployee = () => {
  const employeeRoles = [];
  connection.promise().query("SELECT roles.title FROM roles;")
  .then (([rows]) => {
  for (row of rows){
    employeeRoles.push(row.title)
  };

  let currentManagers = [];
  connection.promise().query('SELECT first_name, last_name FROM employee;')
      .then(([rows]) => {
          for (row of rows) {
              currentManagers.push(row.first_name + " " + row.last_name);
          }
          currentManagers.unshift('None');

    inquirer.prompt([
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
          choices: employeeRoles
        },
        {
          type: "list",
          message: "Who is the employee's manager?",
          name: "managerId",
          choices: currentManagers
        }
      ])
      .then((data) => {
        const eFirstName = data.eFirstName;
        const eLastName = data.eLastName;
        let rolesId;
        connection.promise().query(`SELECT id FROM roles WHERE title = "${data.rolesId}";`)
        .then(([rows])=> {
          console.log(rows[0].id);
          rolesId = rows[0].id;
          connection.promise().execute("INSERT INTO employee (first_name, last_name, roles_id) VALUES (?, ?, ?);", [eFirstName, eLastName, rolesId])
            
          let manager = data.managerId.split(" ");
          let managerId;
          connection.promise().query('SELECT id FROM employee WHERE first_name =' + "'" + manager[0] + "'" + ' AND last_name =' + "'" + manager[1] + "'" + ';')
          .then (([mngrs]) => {
            managerId = mngrs[0].id;
            connection.promise().execute("INSERT INTO employee (first_name, last_name, roles_id, manager_id) VALUES (?, ?, ?, ?);", [eFirstName, eLastName, rolesId, managerId])
            
            startApp();
          })
                    
        })
      });
    })
  })
}  
function updateEmployee() {
    const dataDpt = 'SELECT CONCAT(employee.first_name, " ", employee.last_name) AS "Employee" FROM employee;'
    connection.promise().query(dataDpt) 
    .then (([rows]) => {
      let Employees = [];
      for (row of rows) {
        Employees.push(row.Employee)
      };
    const dataRoles = 'SELECT title FROM roles;'
    connection.promise().query(dataRoles) 
    .then (([rows]) => {
      let roles = [];
      for (row of rows) {
        roles.push(row.title)
      }
        inquirer
            .prompt([
        {
          type: "list",
          message: "Which employee would you like to update?",
          name: "eUpdate",
          choices: Employees
        },
  
        {
          type: "list",
          message: "What do you want to update to?",
          name: "updateRoles",
          choices: roles
        }
      ])
      .then(function(answer) {
        connection.promise().query('SELECT id FROM roles WHERE title="' + answer.updateRoles + '";')
        .then(([rows]) => {
          console.log(rows);
            let roles_id = rows[0].id
            let employeeId;
            let eName = answer.eUpdate.split (' ')
            connection.promise().query('SELECT id FROM employee WHERE first_name =' + "'" + eName[0] + "'" + ' AND last_name =' + "'" + eName[1] + "'" + ';')
            .then(([rows]) => {
              employeeId=rows[0].id
              connection.query('UPDATE employee SET roles_id=? WHERE id= ?',[roles_id, employeeId],function(err, res) {
                if (err) throw err;
                console.table(res);
                startApp();
              })
          })
        });
      });
  })
})
}

const exitApp = () =>{
    process.exit();
}

startApp();