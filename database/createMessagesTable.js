import { createConnection } from "./connectSqlite.js";

(async () => {
    const connection = await createConnection();

    // users
    await connection.exec("DROP TABLE IF EXISTS messages");

    const messagesTable = 
    `CREATE TABLE messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        socketId TEXT NOT NULL,
        message TEXT NOT NULL,
        userType INTEGER NOT NULL
    )`;

    await connection.exec(messagesTable);
})();