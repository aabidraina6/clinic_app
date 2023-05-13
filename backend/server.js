const express = require("express");
const { pool } = require("./db/db");
const { router } = require("./routes/router");
const bodyParser = require("body-parser");

const app = express();

const port = 4000;

app.use(bodyParser.json());
app.use(router);



pool.connect((err, client) => {
  if (err) {
    console.error(err);
  } else {
    console.log("PostgreSQL connected successfully");
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`app  listening at http://localhost:${port}`);
});

const tableName = "patient_data";

const checkTableExistsQuery = `
  SELECT EXISTS (
    SELECT 1
    FROM   information_schema.tables 
    WHERE  table_schema = 'public'
    AND    table_name = $1
  );
`;

const createTableQuery = `
  CREATE TABLE ${tableName} (
    id SERIAL,
    name VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    token VARCHAR(20) NOT NULL PRIMARY KEY, 
    isactive BOOLEAN DEFAULT FALSE , 
    created_at TIMESTAMP DEFAULT NOW()
  );
`;

// const tableName = 'my_table';

// const dropTableQuery = `
//   DROP TABLE IF EXISTS ${tableName};
// `;

// pool.query(dropTableQuery, (err, res) => {
//   if (err) {
//     console.error(`Error dropping table ${tableName}:`, err);
//   } else {
//     console.log(`Table "${tableName}" dropped`);
//   }
//   pool.end();
// });

pool.query(checkTableExistsQuery, [tableName], (err, res) => {
  if (err) {
    console.error("Error checking if table exists:", err);
  } else {
    const exists = res.rows[0].exists;
    if (!exists) {
      pool.query(createTableQuery, (err, res) => {
        if (err) {
          console.error("Error creating table:", err);
        } else {
          console.log(`Table "${tableName}" created`);
        }
        // pool.end();
      });
    } else {
      console.log(`Table "${tableName}" already exists`);
      // pool.end();
    }
  }
});

// module.exports = {wsServer}


