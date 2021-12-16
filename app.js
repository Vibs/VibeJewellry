import express from "express";
const app = express();

import dotenv from 'dotenv';
dotenv.config();


app.use(express.static("public")); // defines that express finds static files in the public-folder
app.use(express.json()); // makes express interprer incoming data as json
app.use(express.urlencoded({extended: true})); // supports data from forms - needed to parse form-data


//------- ROUTES

import contactRouter from "./routers/contact.js";
app.use(contactRouter.router);

import jewelryRouter from "./routers/jewelry.js";
app.use(jewelryRouter.router);


// Forbereder siderne
import { createPage } from "./render.js";

const frontpage = createPage("frontpage/frontpage.html", {
    title: "VibeJewelry",
    styling: "frontpage/frontpage.css"
});

const contactPage = createPage("contact/contact.html", {
    title: "Kontakt",
    script: "contact/contact.js"
});

const jewelryPage = createPage("jewelry/jewelry.html", {
    title: "Smykker",
    script: "jewelry/jewelry.js",
    styling: "jewelry/jewelry.css",
});


// endpoints
app.get("/", (req, res) => {
    res.send(frontpage);
})

app.get("/contact", (req, res) => {
    res.send(contactPage);
})

app.get("/jewelry", (req, res) => {
    res.send(jewelryPage);
})























const PORT = 8080;
app.listen(PORT, (error) => {
    error ? console.log("Error starting server:", error) : console.log("Starting server on port", PORT);
});