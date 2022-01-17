import express from "express";
const router = express.Router();

import authRouter from "./adminAuth.js";

// forberedte sider
import { adminPages } from "../render.js";

// serverer siderne
router.get("/admin/login", (req, res) => {
    res.send(adminPages.loginPage);
});

router.get("/admin", authRouter.authenticateToken, (req, res) => {
    res.send(adminPages.frontpage);
});

router.get("/admin/jewelry/create", authRouter.authenticateToken, (req, res) => {
    res.send(adminPages.create);
});

router.get("/admin/jewelry/edit/:id", authRouter.authenticateToken, (req, res) => {
      res.send(adminPages.editPage.replace("%%ID%%", req.params.id));
});

router.get("/admin/jewelry/delete/:id", authRouter.authenticateToken, (req, res) => {
    res.send(adminPages.deletePage.replace("%%ID%%", req.params.id));
});




export default {
    router
};
