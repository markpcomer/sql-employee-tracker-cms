\c employee

INSERT INTO department (department_name)
VALUES 
    ('Jewelry'),
    ('Hospitality'),  
    ('Military'),


INSERT INTO role 
    (department_id, title, salary)
VALUES
    (1, 'Miner',  50),
    (1, 'Transporter', 0),
    (1, 'Storage', 0),

    (2, 'Sommelier', 50),
    (2, 'Manager', 75),
    (2, 'Herb Gardener', 50),
    (2, 'Bouncer', 25),

    (3, 'Archer', 75),
    (3, 'Ranging', 150),
    (3, 'Target', 0),
    (3, 'Counter-Intelligence', 300);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Gimli', 'Gloin', 1, NULL),
    ('Frodo', 'Baggins', 1, 1),
    ('Gollum', 'Smeagol', 1, NULL),

    ('Pippin', 'Took', 2, NULL),
    ('Merry', 'Brandybuck', 2, 2),
    ('Samwise', 'Gamgee', 2, NULL),
    ('Treebeard', 'Fangorn', 2, NULL),

    ('Legolas', 'Greenleaf', 3, NULL),
    ('Aragorn', 'Ellesar Telcontar', 3, 3),
    ('Boromis', 'ben-Denethor', 3, NULL),
    ('Grima', 'Wormtongue', 3, NULL);

-- Jewelry:
-- Miner: Gimli,
-- Transporter: Frodo,
-- Storage: Gollum

-- Hospitality:
-- Bartender: Pippin,
-- Manager: Merry,
-- Landscaper: Samwise,
-- Bouncer: Treebeard

-- Military:;
-- Archery, Legolas
-- Ranging, Aragorn
-- Target, Bormir
-- Counter-Intelligence, Grima Wormtongue


