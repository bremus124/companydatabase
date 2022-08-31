const inquirer = require('inquirer');
const mysql = require('mysql2');
require('console.table');
const db = require('./db/connection');

const PORT = process.env.PORT || 3001;


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

    ]).then(answer => {
        let option = answer.option;
        switch(option.toLowerCase()){
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
    const dataDpt = "SELECT departments.id, departments.name FROM departments;"
    db.query(dataDpt, (err, result) => {
        if (err) throw err;
        console.table(result);
        startApp()
    });
}



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