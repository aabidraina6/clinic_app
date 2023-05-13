const express = require("express");
const router = express.Router();
const { pool } = require("../db/db");
const WebSocketServer  = require("ws").Server;

let clients = []

const wsServer = new WebSocketServer({ 
  port : 4001 , 
  });

  wsServer.on('connection', function(connection) {
    clients.push(connection)
    // Generate a unique code for every user
    // const userId = uuidv4();
    console.log(`Recieved a new connection.`);
  // connection.send("hello !")
  connection.on('message' , async(message) =>{
    // console.log('message' , message)
    const tett = await getActive();
    if(Object.keys(tett).length === 0)return ;
    const token  = tett[0].token;
    // console.log(token)
    clients.forEach((con) => {
      con.send(JSON.stringify(token));
    });
  })
    // Store the new connection and handle messages
    // clients[userId] = connection;
    console.log(` connected.`);
  });

const getCount = function () {
  return new Promise((resolve, reject) => {
    const countQuery = `SELECT COUNT(*) FROM patient_data;`;
    pool.query(countQuery, (err, res) => {
      if (err) {
        reject(err);
      } else {
        const rowCount = res.rows[0].count;
        resolve(rowCount);
      }
    });
  });
};

const checkRowExists = async (tableName, columnName, columnValue) => {
  const query = {
    text: `SELECT * FROM ${tableName} WHERE ${columnName} = $1`,
    values: [columnValue],
  };
  const result = await pool.query(query);
  return result.rows.length > 0;
};

const getAll = async () => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT *  FROM patient_data ORDER BY created_at ASC ;",
      (err, res) => {
        if (err) {
          reject(err);
        } else {
          // return res.rows;
          resolve(res.rows);
          console.log(res.rows.length)
        }
        //   pool.end();
      }
    );
  });
};

const getByToken = async (token) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT *  FROM patient_data  WHERE token = $1;",
      [token],
      (err, res) => {
        if (err) {
          reject(err);
        } else {
          // return res.rows;
          resolve(res.rows);
        }
        //   pool.end();
      }
    );
  });
};

const getActive = async () => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT *  FROM patient_data  WHERE isactive = $1;",
      [true],
      (err, res) => {
        if (err) {
          reject(err);
        } else {
          // return res.rows;
          resolve(res.rows);
        }
        //   pool.end();
      }
    );
  });
};

const getLatest = async () => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM patient_data ORDER BY created_at DESC LIMIT 1;",
      (err, res) => {
        if (err) {
          reject(err);
        } else {
          // return res.rows;
          resolve(res.rows);
        }
        //   pool.end();
      }
    );
  });
};

const updateToken = async (token, newVal) => {
  //     const token = 'your_token_value';
  // const newValue = 'new_value';
  const updateQuery = `
  UPDATE patient_data
  SET isactive = $1
  WHERE token = $2;
`;
  pool.query(updateQuery, [newVal, token], (err, res) => {
    if (err) {
    } else {
    }
  });
};

router.post("/api/change_token", async (req, res) => {
  try {
    // const { token, newVal } = req.body;
    const curr = await getActive();
    if (Object.keys(curr).length === 0) {
      res.status(203).json({ error: "user not found" });
      return;
    }
    const old = curr[0].token;
    const n = old.length - 1;
    const last = parseInt(old[n]);
    const temp = old.substring(0, n);
    const next = temp + `${last + 1}`;
    const exists = await getByToken(next);
    if (Object.keys(exists).length === 0) {
      await updateToken(old, false);
      res.status(203).json({ error: "patient not found" });
    } else {
      await updateToken(old, false);
      await updateToken(next, true);
   
      res.status(200).json(next);
    }

    // await updateToken(token, newVal);
    // res.status(200).json({ Message: "update successful" });
  } catch (error) {
    res.status(400).json({ error: "update failed" });
  }
});

router.get("/api/get_all", async (req, res) => {
  try {
    const allData = await getAll();
    res.status(200).json(allData);
  } catch (error) {
  }
});

router.post("/api/next_patient", async (req, res) => {
  try {
    const { token } = req.body;
    const user = await getByToken(token);
    if (Object.keys(user).length === 0) {
      res.status(402).json({ error: "patient not found" });
    } else {
    }
  } catch (err) {
    res.status(401).json({ Error: "server error" });
  }
});

router.post("/api/add_patient", async (req, res) => {
  try {
    const { name, phone } = req.body;
    // const data = await getAll();
    const latest = await getLatest();
    const active = await getActive();

    var token;
    var isactive = false;

    if (Object.keys(active).length === 0) isactive = true;

    if (Object.keys(latest).length === 0) {
      token = "T-101";
    }
    else
    {
      var x = "rter";

      const n = latest[0].token.length - 1;
      const last = parseInt(latest[0].token.substring(2 , n+1));
      var temp = latest[0].token.substring(0, 2);
      token = temp + `${last + 1}`;
    }
    // return;

    // const count =await getCount()
    var ans = await getCount();
    // return ;
    if (ans === 0) {
      isactive = true;
      const insertQuery = `
        INSERT INTO patient_data (name, phone, token , isactive) 
        VALUES ('${name}', '${phone}', '${token}', '${isactive}');
      `;
      pool.query(insertQuery, async (err, res) => {
        if (err) {
        } else {
          isOk = true;
        }
        // pool.end();
      });
    } else {
      const insertQuery = `
        INSERT INTO patient_data (name, phone, token , isactive) 
        VALUES ('${name}', '${phone}', '${token}', '${isactive}');
      `;
      const exists = await checkRowExists("patient_data", "token", token);
      if (!exists) {
        pool.query(insertQuery, (err, res) => {
          if (err) {
            //   res.status(400).json({"message" : "patient already exists"})
          } else {
            isOk = true;

            //   res.status(200).json({"message" : "patient added successfully"})
          }
          // pool.end();
        });
      }
    }
    if (1) {
      res.status(200).json({ message: "patient added successfully" });
    }
  } catch (err) {
    res.status(400).json({ error: "server error" });
  }
});



module.exports = { router };
