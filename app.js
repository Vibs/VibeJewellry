import express from "express";
const app = express();
app.use(express.static("public")); // defines that express finds static files in the public-folder
app.use(express.json()); //parses incoming requests with JSON data
//app.use(express.urlencoded({extended: true})); // supports data from forms - needed to parse form-data . men jeg bruger ikke forms men fetch

import dotenv from 'dotenv';
dotenv.config();

//------- ROUTES
import adminAuthRouter from "./routers/auth/adminAuth.js";
app.use(adminAuthRouter.router);
import userAuthRouter from "./routers/auth/userAuth.js";
app.use(userAuthRouter.router);
import contactRouter from "./routers/contact.js";
app.use(contactRouter.router);
import jewelryRouter from "./routers/jewelry.js";
app.use(jewelryRouter.router);
import cartItemRouter from "./routers/cartItems.js";
app.use(cartItemRouter.router);
import userRouter from "./routers/users.js";
app.use(userRouter.router);
import adminRouter from "./routers/admin.js";
app.use(adminRouter.router);
import { messageRouter } from "./routers/messages.js";
app.use(messageRouter);

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
app.get("/profile", authenticateToken, (req, res) => {
    res.send(customerPages.profilePage);
});
app.get("/cart", authenticateToken, (req, res) => {
    res.send(customerPages.cartPage);
});
app.get("/users/create", (req, res) => {
    res.send(customerPages.createUserPage);
});
app.get("/contact", (req, res) => {
    res.send(customerPages.contactPage);
});
app.get("/orders", (req, res) => {
    res.send(customerPages.ordersPage);
});
app.get("/jewelry", (req, res) => {
    res.send(customerPages.allJewelryPage);
});
app.get("/jewelry/:id", (req, res) => {
    res.send(customerPages.singleJewelryPage.replace("%%ID%%", req.params.id));
});

//------- SOCKET for chat
// funktioner som bruges til at lægge i db
import { messageFunctions } from "./routers/messages.js";

import http from 'http';
const server = http.createServer(app); // app bliver wrappet til en http-server-instans

import { Server } from "socket.io";
const io = new Server(server);

/*
io.emit == sender til ALLE sockets
socket.broadcast.emit == broadcaster den ud til alle andre sockets - men ikke til den selv
socker.emit == sneder kun tilbage til DEN socket
*/


// connection (disconnect) er et default-events - ellers definerer man sine egne events
io.on("connection", (socket) => {
    //-------- customer
    socket.on("send-customer-message", async (message) => {

        // gem i db
        const messageIsSaved = await messageFunctions.saveUserMessage(message, socket.id);

        if(messageIsSaved) {
            socket.broadcast.emit("send-message-to-admin", message, socket.id);
            socket.emit("message-sent-successfully", message);
        } else {
            socket.emit("message-not-sent", "Beskeden blev ikke sendt");
        }
    });

    //------- admin
    socket.on("send-message-to-user", async (message, socketId) => {
        // gem i db
        const messageIsSaved = await messageFunctions.saveAdminMessage(socketId, message); 

        if(messageIsSaved) {
            socket.broadcast.emit("send-message-to-customer", message, socketId);
            socket.emit("admin-message-sent-successfully", message, socketId);
        } else {
            socket.emit("message-not-sent", "Beskeden blev ikke sendt");
        }

    });

    //socket.on("disconnect", () => console.log("Goodbye!!"));
});





const PORT = 8080;
server.listen(PORT, (error) => {
    error ? console.log("Error starting server:", error) : console.log("Starting server on port", PORT);
});