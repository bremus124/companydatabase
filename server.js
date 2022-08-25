const inquirer = require('inquirer');
const mysql = require('mysql2');
const consoletable = require('console.table');
const db = require('./db/connection')

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
                'Add Department',
                'Add Role',
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
            case 'Add Department':
                addDepartment();
                break;
            case 'Add Role':
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
    const dataDpt = "SELECT * FROM department;"
    db.query(dataDpt, (err, result) => {
        if (err) throw err;
        console.table(result);
        startApp()
    });
}



const addDepartment = ()=> {
    inquirer.prompt([
        {
            name: 'department',
            message: 'Enter the name of the department',
        }
    ])
    .then(res => {
        const addDept = "INSERT INTO department (name) VALUES (?)";
        db.query(addDept, [res.department], (err, data) => {
            if (err) throw err;
            console.log(`added ${res.department}to the database`);
            startApp()
        });
    });
}

const exitApp = () =>{
    process.exit();
}

startApp();