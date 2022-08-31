INSERT INTO departments(departments_name)
VALUES ('Sales'),
('Engineering'),
('Finance'),
('Legal');

INSERT INTO roles(title, salary, departments_id)
VALUES ('Sales Lead', 10000, 1),
    ('Salesperson', 80000, 1),
    ('Lead Engineering', 150000, 2),
    ('Software Engineer', 120000, 2),
    ('Account Manager', 160000, 3),
    ('Accountant', 125000, 3),
    ('Legal Team Lead', 250000, 4),
    ('Lawyer', 190000, 4);

INSERT INTO employee(first_name, last_name, roles_id, manager_id)
VALUES('John',  'Doe', 1, NULL),
    ('Michael', 'Chan', 2, 1),
    ('Ashley', 'Rains', 3, NULL),
    ('Kevin', 'Tupik', 4, 3),
    ('Kunal', 'Sing', 5, NULL),
    ('Malia', 'Brown', 6, 5),
    ('Sarah', 'Lourd', 7, NULL),
    ('Tom', 'Allen', 8, 7);

 


















































































































































































































































































































































































































































