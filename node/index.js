const express = require("express");
const { promisify } = require("util");
const mysql = require("mysql");
const app = express();
const PORT = 3000;
const config = {
  host: "db-node",
  user: "root",
  password: "database",
  database: "nodedb",
};

const connection = mysql.createConnection(config);
const migration =
  "CREATE TABLE IF NOT EXISTS people (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255))";
const sql = `INSERT INTO people (name) VALUES ('John')`;
connection.query(migration);
connection.query(sql);
connection.end();

app.get("/", async (req, res) => {
  const connection = mysql.createConnection(config);
  const query = promisify(connection.query).bind(connection);

  let response = "<h1>Full Cycle Rocks!</h1>\n\n<br>";
  try {
    const data = await query("SELECT name FROM people");
    response += data.map((person) => `<li>${person.name}</li>`).join("\n");
  } catch {
    response += "<h2>Error!</h2>";
  }
  connection.end();
  return res.send(response);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
