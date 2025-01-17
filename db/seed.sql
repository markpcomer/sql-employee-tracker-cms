
INSERT INTO department (name)
VALUES 
    ('Jewelry'),
    ('Hospitality'),  
    ('Military');


INSERT INTO role 
    (title, salary, department_id)
VALUES
    ('Miner', 50, 1),
    ('Transporter', 0, 1),
    ('Storage', 0, 1),
    ('Sommelier', 50, 2),
    ('Manager', 75, 2),
    ('Herb Gardener', 50, 2),
    ('Bouncer', 25, 2),
    ('Archer', 75, 3),
    ('Ranger', 150, 3),
    ('Target', 0, 3),
    ('Counter-Intelligence', 300, 3);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Gimli', 'Gloin', 1, NULL),
    ('Frodo', 'Baggins', 2, 1),
    ('Gollum', 'Smeagol', 3, NULL),
    ('Pippin', 'Took', 4, NULL),
    ('Merry', 'Brandybuck', 5, 2),
    ('Samwise', 'Gamgee', 6, NULL),
    ('Treebeard', 'Fangorn', 7, NULL),
    ('Legolas', 'Greenleaf', 8, NULL),
    ('Aragorn', 'Ellesar', 9, 3),
    ('Boromir', 'ben-Denethor', 10, NULL),
    ('Grima', 'Wormtongue', 11, NULL);




