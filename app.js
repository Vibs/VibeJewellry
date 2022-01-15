import express from "express";
const app = express();
app.use(express.static("public")); // defines that express finds static files in the public-folder
app.use(express.json()); // makes express interprer incoming data as json
app.use(express.urlencoded({extended: true})); // supports data from forms - needed to parse form-data

import dotenv from 'dotenv';
dotenv.config();



//------- ROUTES
import authRouter from "./routers/auth.js";
app.use(authRouter.router);

import contactRouter from "./routers/contact.js";
app.use(contactRouter.router);

import jewelryRouter from "./routers/jewelry.js";
app.use(jewelryRouter.router);

import adminRouter from "./routers/admin.js";
app.use(adminRouter.router);

// func som bruges til at forberede siderne
import { createPage } from "./render.js";
import cookieParser from "cookie-parser";

// Forbereder siderne
const frontpage = createPage("frontpage/frontpage.html", {
    title: "Hjem",
    styling: [{ href: "/views/frontpage/frontpage.css" }]
});

const contactPage = createPage("contact/contact.html", {
    title: "Kontakt",
    script: [{ src: "/views/contact/contact.js" }],
    styling: [{ href: "/views/contact/contact.css"}]

});

const allJewelryPage = createPage("jewelry/jewelry.html", {
    title: "Smykker",
    script: [{ src: "/views/jewelry/jewelry.js" }],
    styling: [{ href: "/views/jewelry/jewelry.css"}]
});

const singleJewelryPage = createPage("single-jewelry/singleJewelry.html", {
    title: "Smykker",
    script: [{ src: "/views/single-jewelry/singleJewelry.js"}],
    styling: [{ href: "/views/single-jewelry/singleJewelry.css" }],
});

// endpoints
app.get("/", (req, res) => {
    res.send(frontpage);
})

app.get("/contact", (req, res) => {
    res.send(contactPage);
})

app.get("/jewelry", (req, res) => {
    res.send(allJewelryPage);
})

app.get("/jewelry/:id", (req, res) => {
    res.send(singleJewelryPage.replace("%%ID%%", req.params.id));
})


const PORT = 8080;
app.listen(PORT, (error) => {
    error ? console.log("Error starting server:", error) : console.log("Starting server on port", PORT);
});