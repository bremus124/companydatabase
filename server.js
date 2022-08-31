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
            const dataDpt = 'SELECT employee.id AS "ID", CONCAT(employee.first_name, " ", employee.last_name) AS "Employee Name",salary AS "Salary", title AS "Title", departments.departments_name AS "Department" FROM employee INNER JOIN roles ON employee.roles_id = roles.id INNER JOIN departments ON roles.departments_id = departments.id ORDER BY employee.id;'
            connection.promise().query(dataDpt) 
            .then (([rows]) => {
                console.table(rows);
                startApp()
            }) 
                
            };


const addDepartments = ()=> {
    inquirer.prompt([
        {
            name: 'departments',
            message: 'Enter the name of the departments',
        }
    ])
    .then(res => {
        const addDept = "INSERT INTO departments (name) VALUES (?)";
        db.query(addDept, [res.departments], (err, data) => {
            console.log(data);
            if (err) throw err;
            console.log(`added ${res.departments}to the database`);
            startApp()
        });
    });
}

const exitApp = () =>{
    process.exit();
}

startApp();