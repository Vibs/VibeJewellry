import express from "express";
const router = express.Router();

import { connection } from "../database/connectSqlite.js";

// GET all
router.get("/api/jewelry", async (req, res) => {
    const projects = await connection.all("SELECT * from jewelry");

    res.send(projects);
});


export default {
    router
};
