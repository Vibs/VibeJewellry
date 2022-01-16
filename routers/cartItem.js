import express from "express";
import { connection } from "../database/connectSqlite.js";
const router = express.Router();

import authRouter from "./userAuth.js";
const authenticateToken = authRouter.authenticateToken;

router.post("/users/:userId/cartItem/:jewelryId", authenticateToken, async (req, res) => {

    // tjek først om der ER dette smykke oprettet som cartItem på denne bruger
    const cartItemFromDb = await connection.all("SELECT * FROM cartItems WHERE userId = ? AND jewelryId = ?", [req.params.userId, req.params.jewelryId])

    if(cartItemFromDb.length > 0) {
        // opdater eksisterende i stedet
        await connection.run("UPDATE cartItems SET amount = ? WHERE id = ?", [cartItemFromDb[0].amount + 1, cartItemFromDb[0].id]);
    } else {
        await connection.run("INSERT INTO cartItems ('userId', 'jewelryId', 'amount') VALUES (?, ?, ?)", [req.params.userId, req.params.jewelryId, 1]);
    }

    res.sendStatus(200);
});

router.get("/users/:userId/cartItems", authenticateToken, async (req, res) => {
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





export default {
    router
};