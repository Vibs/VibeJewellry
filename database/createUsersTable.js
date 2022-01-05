import { createConnection } from "./connectSqlite.js";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

(async () => {
    const connection = await createConnection();

    // admins
    await connection.exec("DROP TABLE IF EXISTS users");

    const usersTable = 
    `CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        password TEXT NOT NULL)`;

    await connection.exec(usersTable);

    
    try{
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(process.env.TEST_USER_PASSWORD, salt);

        connection.run(
            "INSERT INTO users ('username', 'password') VALUES (?, ?)", 
            [process.env.TEST_USER_USERNAME, hashedPassword]); // bcrypt saves the salt inside the password
    } catch {
        console.log("ERROR creating user");
    }

    // refreshTokens
    await connection.exec("DROP TABLE IF EXISTS refresh_tokens");

    const refreshTokensTable = 
    `CREATE TABLE refresh_tokens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        token TEXT NOT NULL)`;

    await connection.exec(refreshTokensTable);

    /*
    await connection.run(
        "INSERT INTO refresh_tokens ('token') VALUES (?)", 
        ["Token yas"]);
    

    console.log(await connection.all("SELECT * FROM refresh_tokens"));
    */
})()