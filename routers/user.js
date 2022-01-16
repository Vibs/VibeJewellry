import express from "express";
const router = express.Router();

import bcrypt from "bcrypt";
import { connection } from "../database/connectSqlite.js";


router.post("/users", async (req, res) => {
    const userFromBody = req.body;

    if(userFromBody) {

        // first check if email is available
        const userFromDb = await connection.all("SELECT * FROM users WHERE email = ?", 
            [userFromBody.email]
        ); 

        if(userFromDb.length < 1) {
            console.log("Der findes ikke noget i db med den mail");
            try{
                const salt = await bcrypt.genSalt();
                const hashedPassword = await bcrypt.hash(userFromBody.password, salt);
            
                await connection.run("INSERT INTO users ('username', 'email', 'password') VALUES (?, ?, ?)", 
                    [userFromBody.username, userFromBody.email, hashedPassword] // bcrypt saves the salt inside the password
                ); 

                res.sendStatus(200);
            } catch {
                res.sendStatus(500); // internal server error
            }
        } else {
            res.sendStatus(409); // conflict
        }
    } else {
        res.sendStatus(400); // Bad request
    }
});







export default {
    router
};
