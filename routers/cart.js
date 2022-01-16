import express from "express";
import { connection } from "../database/connectSqlite.js";
const router = express.Router();

import authRouter from "./userAuth.js";
const authenticateToken = authRouter.authenticateToken;


router.post("/users/:userId/cart", authenticateToken, (req, res) => {
    const cartItem = req.body;

    // hent ens varenr. op
    // FOREIGN KEY(userId) REFERENCES users(id)

    // hvis samme varenr. allerede findesændr i dets antal

    // ellers hvis den ikke findes: tilføj


});

router.get("/users/:userId/cart", authenticateToken, async (req, res) => {
    console.log("Hej");

    console.log(req.user);

    const userId = req.params.userId;

    const cartItems = await connection.all("SELECT * FROM cartItems WHERE userId = ?", [userId]);

    res.send(cartItems);
});


export default {
    router
};