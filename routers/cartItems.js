import express from "express";
const router = express.Router();

import { connection } from "../database/connectSqlite.js";

import authRouter from "./auth/userAuth.js";
const authenticateToken = authRouter.authenticateToken;

router.post("/api/cartItems" , authenticateToken, async (req, res) => {
    const cartItem = req.body;

    const userId = req.cookies.userId;
    console.log("Hej fra post userId", userId);

    // tjek først om der ER dette smykke oprettet som cartItem på denne bruger
    const cartItemFromDb = await connection.all("SELECT * FROM cartItems WHERE userId = ? AND jewelryId = ?", [userId, cartItem.jewelryId])
    console.log("cartItemFromDb", cartItemFromDb);
    if(cartItemFromDb.length > 0) {
        console.log("allerede samme i db");
        // opdater eksisterende i stedet
        await connection.run("UPDATE cartItems SET amount = ? WHERE id = ?", [cartItemFromDb[0].amount + 1, cartItemFromDb[0].id]);
    } else {
        console.log("ikke samme i db");

        await connection.run("INSERT INTO cartItems ('userId', 'jewelryId', 'amount') VALUES (?, ?, ?)", [userId, cartItem.jewelryId, cartItem.amount]);
    }

    res.sendStatus(200);
});

router.get("/api/cartItems", authenticateToken, async (req, res) => {
    const userId = req.cookies.userId;

    let cartItems = await connection.all("SELECT * FROM cartItems WHERE userId = ?", [userId]);

    cartItems = await Promise.all(cartItems.map(async cartItem => {
        // hent jewelry-item og sæt den på hvert cart-item
        const jewelry = await connection.all("SELECT * FROM jewelry WHERE id = ?", [cartItem.jewelryId]);
        cartItem.jewelry = jewelry[0];
        return cartItem;
    }));

    res.send(cartItems);
});

router.patch("/api/cartItems/:id", authenticateToken, (req, res) => {
    const cartItem = req.body;

    connection.run("UPDATE cartItems SET amount = ? WHERE id = ?", [cartItem.amount, req.params.id]);

    res.sendStatus(200);
});

router.delete("/api/cartItems/:id", authenticateToken, async (req, res) => {
   
    const id = req.params.id;

    await connection.run("DELETE FROM cartItems WHERE id = ?", id);

    const deletedCartItem = await connection.all("SELECT * FROM cartItems WHERE id = ?", id);

    console.log("deletedCartItem", deletedCartItem);
    if(deletedCartItem.length == 0){
        res.sendStatus(200);
    } else {
        res.sendStatus(500);
    }
});





export default {
    router
};