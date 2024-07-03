const { Pool } = require('pg');

const pool = new Pool (
    {
        user: "postgres",
        password: "",
        host: "localhost",
        database: "employee_db",
        port: 5432
    },
    console.log("Connected to database")
);

pool.connect();