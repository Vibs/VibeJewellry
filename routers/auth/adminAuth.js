import express from "express";
const router = express.Router();

import dotenv from "dotenv";
dotenv.config();

import cookieParser from "cookie-parser";
router.use(cookieParser());

// jeg fik cors-problemer fordi jeg fetcher fra login.js
// derfor: npm i cors
// TODO tjek om det stadig er relevant eller om den skal slettes
import cors from "cors";
router.use(cors());

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { connection } from "../../database/connectSqlite.js";


// callbacken er async fordi jeg bruger bcrypt, som er et async library
router.post("/admin/login", async (req, res) => {
    // authenticate user
    //https://www.youtube.com/watch?v=Ud5xKCYQTjM

    const userFromBody = req.body;
  
    const adminFromDb = await connection.all("SELECT * FROM admins WHERE username=?", userFromBody.username);

    if(adminFromDb.length < 1){
        return res.status(400).send('Cannot find user');
    }
    try{
        // hvis password matcher den fundne bruger
        if(await bcrypt.compare(userFromBody.password, adminFromDb[0].password)){
             // så jwt
            //https://www.youtube.com/watch?v=mbsmsi7l3r4
            // generer accessToken med brugerinformation

            const user = { name: userFromBody.username };

            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);

            await connection.run("INSERT INTO refresh_tokens ('token') VALUES (?)", 
            [refreshToken]);

            res.cookie('accessToken', accessToken, {
                maxAge: 86_400_000,
                httpOnly: true,
            });

            res.cookie('refreshToken', refreshToken, {
                maxAge: 86_400_000,
                httpOnly: true,
            });

            //res.json({accessToken: accessToken, refreshToken: refreshToken});
            res.json({accessToken: accessToken});
        }
        else { // ikke rigtigt password
            res.sendStatus(403);// forbidden
        }
    } catch {
        res.sendStatus(500);
    }
});


const authenticateToken = (req, res, next) => {
    // TODO det er hre jeg er nået til
    const accessToken = req.cookies.accessToken;

    if(accessToken == null){
        return res.redirect('/admin/login');
    }

    // user == det objekt som vi i get(/login) seriliserede i jwt.sign()
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
        if(error){ // token'en er ikke valid
            console.log("Tokenen er ikke valid");
            // prøv med refresh
            //-----------REFRESH-----------

            return tryWithRefreshToken(req, res, next);
        }
        // accessToken er valid
        req.user = user;
        next(); // kalder den callback som bliver givet med når vi kalder authenticateToken()-func
    })
}


const tryWithRefreshToken = async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
            
    if(refreshToken == null) { // hvis ingen refreshToken
        return res.sendStatus(401);
    }

     // leder efter refreshToken'en i db
    const refreshTokensFromDb = await connection.all(
        "SELECT * FROM refresh_tokens WHERE token = ?", 
        [refreshToken]
    );

    // hvis den IKKE er der
    if(refreshTokensFromDb.length < 1){
        // refreshToken som du sendte er ikke i db - så du har ikke access
        return res.redirect('/admin/login');
    }

    // hvis den blev fundet i db - bekræft at refreshTokenet er det rigtige
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
        if(error) {
            return res.redirect('/admin/login');
        }

         // hvis den er valid
        console.log("NY REFRESH");
        // hvis det ER rigtigt - så dan et nyt accesstoken, som returneres
        // {name: user.name} og IKKE bare user, fordi user-obj indeholder noget additional info
        const accessToken = generateAccessToken({name: user.name});
        const newRefreshToken = generateRefreshToken({name: user.name});

        res.cookie('accessToken', accessToken, {
            maxAge: 86_400_000,
            httpOnly: true,
        });

        res.cookie('refreshToken', newRefreshToken, {
            maxAge: 86_400_000,
            httpOnly: true,
        });

        // læg ny refreshToken i db
        connection.run("INSERT INTO refresh_tokens ('token') VALUES (?)", 
        [newRefreshToken]);
       
        // slet gamle refreshToken
        connection.run("DELETE FROM refresh_tokens WHERE token = ?", [refreshToken]);

        //req.user = user; // tilføj evt senere: kan være den skal bruges
        next();
    });
}


router.delete("/admin/logout", async (req, res) => {
    connection.run("DELETE FROM refresh_tokens WHERE token = ?", [req.cookies.refreshToken]);

    const tokenFromDb = await connection.all("SELECT * FROM refresh_tokens WHERE token = ?", [req.cookies.refreshToken]);

    res.sendStatus(200);
})

function generateAccessToken(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '10s'});
}

function generateRefreshToken(user) {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '1d'});
}

export default {
    router, authenticateToken
};
