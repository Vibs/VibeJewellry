import express from "express";
const app = express();
app.use(express.static("public")); // defines that express finds static files in the public-folder
app.use(express.json()); // makes express interprer incoming data as json
app.use(express.urlencoded({extended: true})); // supports data from forms - needed to parse form-data

import dotenv from 'dotenv';
dotenv.config();

//------- ROUTES
import adminAuthRouter from "./routers/adminAuth.js";
app.use(adminAuthRouter.router);
import userAuthRouter from "./routers/userAuth.js";
app.use(userAuthRouter.router);
import contactRouter from "./routers/contact.js";
app.use(contactRouter.router);
import jewelryRouter from "./routers/jewelry.js";
app.use(jewelryRouter.router);
import cartItemRouter from "./routers/cartItem.js";
app.use(cartItemRouter.router);
import userRouter from "./routers/user.js";
app.use(userRouter.router);
import adminRouter from "./routers/admin.js";
app.use(adminRouter.router);

// forberedte sider
import { customerPages } from "./render.js";

// func som bruges til at authenticate brugeren
const authenticateToken = userAuthRouter.authenticateToken;

// endpoints
app.get("/", (req, res) => {
    res.send(customerPages.frontpage);
});
app.get("/users/login", (req, res) => {
    res.send(customerPages.loginPage);
});
app.get("/users/:userId/profile", authenticateToken, (req, res) => {
    res.send(customerPages.profilePage);
});
app.get("/users/create", (req, res) => {
    res.send(customerPages.createUserPage);
});
app.get("/users/:userId/cart", authenticateToken, (req, res) => {
    res.send(customerPages.cartPage);
});
app.get("/contact", (req, res) => {
    res.send(customerPages.contactPage);
});
app.get("/cart", (req, res) => {
    res.send(customerPages.preLogInCartPage);
});
app.get("/jewelry", (req, res) => {
    res.send(customerPages.allJewelryPage);
});
app.get("/jewelry/:id", (req, res) => {
    res.send(customerPages.singleJewelryPage.replace("%%ID%%", req.params.id));
});




const PORT = 8080;
app.listen(PORT, (error) => {
    error ? console.log("Error starting server:", error) : console.log("Starting server on port", PORT);
});