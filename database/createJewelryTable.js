import { createConnection } from "./connectSqlite.js";

(async () => {
    const connection = await createConnection();

    await connection.exec("DROP TABLE IF EXISTS jewelry");

    const jewelryTable = 
    `CREATE TABLE jewelry (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        collection TEXT,
        price REAL NOT NULL,
        image_path TEXT)`; // TODO udkommenter denne

    console.log("i gang med db");

    await connection.exec(jewelryTable);

    connection.run("INSERT into jewelry ('name', 'price', 'image_path') VALUES (?, ?, ?)", 
    "Vibes pæneste øreringe", 250.0, "ørering1.jpg");
})() 