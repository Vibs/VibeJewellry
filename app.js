import express from "express";
const app = express();

app.use(express.static("public")); // defines that express finds static files in the public-folder
app.use(express.json()); // makes express interprer incoming data as json
app.use(express.urlencoded({extended: true})); // supports data from forms - needed to parse form-data

import { createPage } from "./render.js";



app.get("/", (req, res) => {
    res.send(createPage("frontpage/frontpage.html", "noget"));
})






















const PORT = 8080;
app.listen(PORT, (error) => {
    error ? console.log("Error starting server:", error) : console.log("Starting server on port", PORT);
});