import express from "express";
const router = express.Router();

// TODO udkommenter hvis den ikke bliver brugt - tror ikke den skla bruges, fordi alle api-kalender sker jo i jewelry-routeren
//import { connection } from "../database/connectSqlite.js";

// func som bruges til at forberede siderne
import { createPage } from "../render.js";

// Forbereder siderne
const frontpage = createPage("frontpage/frontpage.html", {
    admin: true,
    title: "Alle smykker",
    styling: [{ href: "/admin-views/frontpage/frontpage.css"}],
    script: [{ src: "/admin-views/frontpage/frontpage.js"}]
});

const create = createPage("create-jewelry/create-jewelry.html", {
    admin: true,
    title: "Opret smykke",
    styling: [{ href: "/admin-views/create-jewelry/create-jewelry.css"}],
    script: [{ src: "/admin-views/create-jewelry/create-jewelry.js"}]
});

// serverer siderne
router.get("/admin", (req, res) => {
    res.send(frontpage);
})

router.get("/admin/jewelry/create", (req, res) => {
    res.send(create);
})

/*
router.get("admin/jewelry/", (req, res) => {
    res.send(allJewelryPage);
})

router.get("/jewelry/:id", (req, res) => {
    res.send(singleJewelryPage.replace("%%ID%%", req.params.id));
})
*/


export default {
    router
};
