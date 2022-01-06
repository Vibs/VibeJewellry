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
    title: "Opret",
    styling: [{ href: "/admin-views/create-jewelry/create-jewelry.css"}],
    script: [{ src: "/admin-views/create-jewelry/create-jewelry.js"}]
});

const editPage = createPage("edit-jewelry/edit-jewelry.html", {
    admin: true,
    title: "Rediger",
    styling: [{ href: "/admin-views/edit-jewelry/edit-jewelry.css"}],
    script: [{ src: "/admin-views/edit-jewelry/edit-jewelry.js"}],
});

const deletePage = createPage("delete-jewelry/delete-jewelry.html", {
    admin: true,
    title: "Slet",
    styling: [{ href: "/admin-views/delete-jewelry/delete-jewelry.css"}],
    script: [{ src: "/admin-views/delete-jewelry/delete-jewelry.js"}],
});

// serverer siderne
router.get("/admin", (req, res) => {
    res.send(frontpage);
})

router.get("/admin/jewelry/create", (req, res) => {
    res.send(create);
})

router.get("/admin/jewelry/edit/:id", (req, res) => {
      res.send(editPage.replace("%%ID%%", req.params.id));
})

router.get("/admin/jewelry/delete/:id", (req, res) => {
    res.send(deletePage.replace("%%ID%%", req.params.id));
})


export default {
    router
};
