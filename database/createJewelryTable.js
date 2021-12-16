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
    "Vibes pæneste øreringe", 249.0, "ørering1.jpg");

    connection.run("INSERT into jewelry ('name', 'price', 'image_path') VALUES (?, ?, ?)", 
    "Creole med farver", 149.0, "ørering2.jpg");

    connection.run("INSERT into jewelry ('name', 'price', 'image_path') VALUES (?, ?, ?)", 
    "Muslingesæt 4 pcs.", 250.0, "ørering3.jpg");

    connection.run("INSERT into jewelry ('name', 'price', 'image_path') VALUES (?, ?, ?)", 
    "Creole med struktur", 299.0, "ørering4.jpg");
})() 