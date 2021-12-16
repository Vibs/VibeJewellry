import { createConnection } from "./connectSqlite.js";

(async () => {
    const connection = await createConnection();

    await connection.exec("DROP TABLE IF EXISTS projects");

    const projectsTableSchema = 
    `CREATE TABLE projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        year TEXT,
        description TEXT,
        link TEXT)`;

    console.log("i gang med db");

    await connection.exec(projectsTableSchema);
})() 