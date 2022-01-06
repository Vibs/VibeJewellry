import express from "express";
const router = express.Router();

import { connection } from "../database/connectSqlite.js";

// endpoints
router.get("/admin/jewelry", (req, res) => {
    res.send(frontpage);
})

app.get("/admin//jewelry/:id", (req, res) => {
    res.send(contactPage);
})

app.get("admin/jewelry/", (req, res) => {
    res.send(allJewelryPage);
})

app.get("/jewelry/:id", (req, res) => {
    res.send(singleJewelryPage.replace("%%ID%%", req.params.id));
})
