import express from "express";
const router = express.Router();

import { connection } from "../database/connectSqlite.js";

// GET
router.get("/api/jewelry", async (req, res) => {
    const jewelry = await connection.all("SELECT * from jewelry");

    res.send(jewelry);
});

//GET én fra id
router.get("/api/jewelry/:id", async (req, res) => {
    const jewelry = await connection.all("SELECT * from jewelry WHERE id = ?", [req.params.id]);

    jewelry ? res.send(jewelry) : res.sendStatus(404);
});

// POST
router.post("/api/jewelry", async (req, res) => {

    const jewelryToCreate = req.body;

    connection.run("INSERT INTO jewelry ('name', 'price', 'stock') VALUES (?, ?, ?)", 
        [jewelryToCreate.name, jewelryToCreate.price, jewelryToCreate.stock]);
    
    res.send(jewelryToCreate);
});

//------------------------ ADMIN - TODO
// UPDATE
router.put("/api/jewelry/:id",  (req, res) => {
    const jewelryToUpdate = req.body.jewwelryFromForm;

    connection.run("UPDATE jewelry SET name = ?, collection = ?, price = ?, stock = ?, WHERE id = ?", 
        [jewelryToUpdate.name, jewelryToUpdate.collection, jewelryToUpdate.price, jewelryToUpdate.stock, req.params.id]);

    res.send(jewelryToUpdate);
});


// DELETE
router.delete("/api/jewelry/:id", async (req, res) => {

    await connection.run("DELETE FROM jewelry WHERE id = ?", [req.params.id], function(err) {
        if (err) {
          res.sendStatus(500);
        }
      });
    res.sendStatus(200);
});

export default {
    router
};
