import { createConnection } from "./connectSqlite.js";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

(async () => {
    const connection = await createConnection();

    // users
    await connection.exec("DROP TABLE IF EXISTS users");

    const usersTable = 
    `CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        email TEXT NOT NULL,
        password TEXT NOT NULL
    )`;

    await connection.exec(usersTable);

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(process.env.TEST_USER_PASSWORD, salt);

    connection.run("INSERT INTO users ('username', 'email', 'password') VALUES (?, ?, ?)", 
        [process.env.TEST_USER_USERNAME, process.env.TEST_USER_USERNAME, hashedPassword] // bcrypt saves the salt inside the password
    ); 

    // cartItems
    await connection.exec("DROP TABLE IF EXISTS cartItems");

    const cartItemsTable = 
        `CREATE TABLE cartItems (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER NOT NULL REFERENCES users(id) ON UPDATE CASCADE,
            jewelryId INTEGER NOT NULL REFERENCES jewelry(id) ON UPDATE CASCADE,
            amount INTEGER NOT NULL)`; /*,
            totalPrice REAL NOT NULL)`; */

    await connection.exec(cartItemsTable);

    connection.run("INSERT INTO cartItems ('userId', 'jewelryId', 'amount') VALUES (?, ?, ?)", 
        [1, 1, 1] // bcrypt saves the salt inside the password
    ); 







    // refreshTokens
    await connection.exec("DROP TABLE IF EXISTS user_refresh_tokens");

    const refreshTokensTable = 
    `CREATE TABLE user_refresh_tokens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        token TEXT NOT NULL
    )`;

    await connection.exec(refreshTokensTable);
})()