import express from "express";
const router = express.Router();

import authRouter from "./auth.js";

import cookieParser from "cookie-parser";
router.use(cookieParser());

import jwt from "jsonwebtoken";

import { connection } from "../database/connectSqlite.js";

// func som bruges til at forberede siderne
import { createPage } from "../render.js";

// Forbereder siderne
const loginPage = createPage("login/login.html", {
    admin: true,
    excludeNavbar: true,
    title: "Login",
    styling: [{ href: "/admin-views/login/login.css"}, 
    {href: "/admin-views/global-admin.css"}],
    script: [{ src: "/admin-views/login/login.js"}]
});

const frontpage = createPage("frontpage/frontpage.html", {
    admin: true,
    title: "Alle smykker",
    styling: [{ href: "/admin-views/frontpage/frontpage.css"}, 
    {href: "/admin-views/global-admin.css"}],
    script: [{ src: "/admin-views/frontpage/frontpage.js"}]
});

const create = createPage("create-jewelry/create-jewelry.html", {
    admin: true,
    title: "Opret",
    styling: [{ href: "/admin-views/create-jewelry/create-jewelry.css"}, 
    {href: "/admin-views/global-admin.css"}],
    script: [{ src: "/admin-views/create-jewelry/create-jewelry.js"}]
});

const editPage = createPage("edit-jewelry/edit-jewelry.html", {
    admin: true,
    title: "Rediger",
    styling: [{ href: "/admin-views/edit-jewelry/edit-jewelry.css"}, 
    {href: "/admin-views/global-admin.css"}],
    script: [{ src: "/admin-views/edit-jewelry/edit-jewelry.js"}],
});

const deletePage = createPage("delete-jewelry/delete-jewelry.html", {
    admin: true,
    title: "Slet",
    styling: [{ href: "/admin-views/delete-jewelry/delete-jewelry.css"}, 
    {href: "/admin-views/global-admin.css"}],
    script: [{ src: "/admin-views/delete-jewelry/delete-jewelry.js"}],
});

// serverer siderne
router.get("/admin/login", (req, res) => {
    res.send(loginPage);
});

router.get("/admin", authRouter.authenticateToken, (req, res) => {
    res.send(frontpage);
});

router.get("/admin/jewelry/create", authRouter.authenticateToken, (req, res) => {
    res.send(create);
});

router.get("/admin/jewelry/edit/:id", authRouter.authenticateToken, (req, res) => {
      res.send(editPage.replace("%%ID%%", req.params.id));
});

router.get("/admin/jewelry/delete/:id", authRouter.authenticateToken, (req, res) => {
    res.send(deletePage.replace("%%ID%%", req.params.id));
});


export default {
    router
};
