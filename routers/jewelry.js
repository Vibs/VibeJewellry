import express from "express";
const router = express.Router();

import fs from "fs";
import authRouter from "./auth/adminAuth.js";


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
router.post("/api/jewelry", authRouter.authenticateToken, async (req, res) => {

    const jewelryToCreate = req.body;

    let imagePath = null;

    if(jewelryToCreate.base64){
        // sæt imagePath to ny imagePath
        imagePath = `./public/assets/images/jewelry/${jewelryToCreate.fileName}`;

        // gem billede lokalt i projekt
        fs.writeFile(imagePath, decodeBase64Image(jewelryToCreate.base64).data, 'base64', function(err) {
            console.log(err);
        });

    }


    const created = connection.run("INSERT INTO jewelry ('name', 'price', 'stock', 'image_path') VALUES (?, ?, ?, ?)", 
        [jewelryToCreate.name, jewelryToCreate.price, jewelryToCreate.stock, jewelryToCreate.fileName]);
    
    res.send(created);
});

function decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
      response = {};
  
    if (matches.length !== 3) {
      return new Error('Invalid input string');
    }
  
    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');
  
    return response;
  }

//------------------------ ADMIN - TODO
// UPDATE
router.patch("/api/jewelry/:id", authRouter.authenticateToken, (req, res) => {

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
router.delete("/api/jewelry/:id", authRouter.authenticateToken, async (req, res) => {

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
