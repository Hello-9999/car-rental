import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "", // empty string if no password set in XAMPP
  database: "ridebook",
  port: 3306, // default MySQL port
});

export default pool;
