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

    const created = connection.run("INSERT INTO jewelry ('name', 'price', 'stock') VALUES (?, ?, ?)", 
        [jewelryToCreate.name, jewelryToCreate.price, jewelryToCreate.stock]);
    
    res.send(created);
});

//------------------------ ADMIN - TODO
// UPDATE
router.patch("/api/jewelry/:id", (req, res) => {

    const jewelryToUpdate = req.body;

    const updated = connection.run("UPDATE jewelry SET name = ?, price = ?, stock = ? WHERE id = ?", 
        [jewelryToUpdate.name, jewelryToUpdate.price, jewelryToUpdate.stock, req.params.id], (error, result) => {
            error ? res.send(500) : res.send(result);
    });

    connection.on("error", function(error) {
        console.log("Getting an error : ", error);
        res.sendStatus(500);
    }); 

    res.send(updated);
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
