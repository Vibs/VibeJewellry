import express from "express";
import { connection } from "../database/connectSqlite.js";
const router = express.Router();

import authRouter from "./auth/userAuth.js";
const authenticateToken = authRouter.authenticateToken;

router.post(`/api/users/:userId/cartItems`, authenticateToken, async (req, res) => {
    const cartItem = req.body;

    // tjek først om der ER dette smykke oprettet som cartItem på denne bruger
    const cartItemFromDb = await connection.all("SELECT * FROM cartItems WHERE userId = ? AND jewelryId = ?", [cartItem.userId, cartItem.jewelryId])

    if(cartItemFromDb.length > 0) {
        // opdater eksisterende i stedet
        await connection.run("UPDATE cartItems SET amount = ? WHERE id = ?", [cartItemFromDb[0].amount + 1, cartItemFromDb[0].id]);
    } else {
        await connection.run("INSERT INTO cartItems ('userId', 'jewelryId', 'amount') VALUES (?, ?, ?)", [cartItem.userId, cartItem.jewelryId, cartItem.amount]);
    }

    res.sendStatus(200);
});

router.get("/api/users/:userId/cartItems", authenticateToken, async (req, res) => {
    const userId = req.params.userId;

    let cartItems = await connection.all("SELECT * FROM cartItems WHERE userId = ?", [userId]);

    cartItems = await Promise.all(cartItems.map(async cartItem => {
        // hent jewelry-item og sæt den på hvert cart-item
        const jewelry = await connection.all("SELECT * FROM jewelry WHERE id = ?", [cartItem.jewelryId]);
        cartItem.jewelry = jewelry[0];
        return cartItem;
    }));

    res.send(cartItems);
});

router.patch("/api/users/:userId/cartItems/:cartItemId", authenticateToken, (req, res) => {
    const cartItem = req.body;

    connection.run("UPDATE cartItems SET amount = ? WHERE id = ?", [cartItem.amount, req.params.cartItemId]);

    res.sendStatus(200);
});

router.delete("/api/users/:userId/cartItems/:cartItemId", authenticateToken, async (req, res) => {
    console.log("Hej fra slet");
    console.log("cartItemId", req.params.cartItemId);
    await connection.run("DELETE FROM cartItems WHERE id = ?", req.params.cartItemId);

    const deletedCartItem = await connection.all("SELECT * FROM cartItems WHERE id = ?", req.params.cartItemId);

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