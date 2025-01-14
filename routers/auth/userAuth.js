import express from "express";
const router = express.Router();

import dotenv from "dotenv";
dotenv.config();

import cookieParser from "cookie-parser";
router.use(cookieParser());

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { connection } from "../../database/connectSqlite.js";

// callbacken er async fordi jeg bruger bcrypt, som er et async library
router.post("/api/users/login", async (req, res) => {
    // authenticate user
    //https://www.youtube.com/watch?v=Ud5xKCYQTjM
    const userFromBody = req.body;
  
    const userFromDb = await connection.all("SELECT * FROM users WHERE email = ?", userFromBody.email);

    if(userFromDb.length < 1) {
    }

    try{
        // hvis password matcher den fundne bruger
        if(await bcrypt.compare(userFromBody.password, userFromDb[0].password)){
            // generer accessToken med brugerinformation
            const user = { email: userFromBody.email };

            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);

            await connection.run("INSERT INTO user_refresh_tokens ('token') VALUES (?)", 
            [refreshToken]);

            res.cookie('accessToken', accessToken, {
                maxAge: 86_400_000,
                httpOnly: true,
            });

            res.cookie('refreshToken', refreshToken, {
                maxAge: 86_400_000,
                httpOnly: true,
            });

            res.cookie('userId', userFromDb[0].id, {
                maxAge: 24 * 60 * 60 * 1000,
                httpOnly: true,
            });
            res.cookie('username', userFromDb[0].username);

            res.json({accessToken: accessToken});
        }
        else { // ikke rigtigt password
            res.sendStatus(403);// forbidden
        }
    } catch {
        res.sendStatus(500); // server error
    }
});


const authenticateToken = (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    
    const userId = req.cookies.userId;

    if(accessToken == null){
        // intet token sendt i header --> derfor ingen access
        return res.redirect('/users/login');
    }

    // user == det objekt som vi i get(/login) seriliserede i jwt.sign()
    jwt.verify(accessToken, process.env.USER_ACCESS_TOKEN_SECRET, async (error, user) => {
        if(error){ // token'en er ikke valid
            // prøv med refresh
            return tryWithRefreshToken(req, res, next);
        }
       
        // tjek at user.email's id matcher med userId fra cookie
        if(await doesTokenUserEmailAndParamUserIdMatch(userId, user.email) == true) {
            next(); // kalder den callback som bliver givet med når vi kalder authenticateToken()-func
        } else { // useren med dette accessToken requester en anden users oplysninger
            return res.redirect('/users/login');
        }
    })
}

async function doesTokenUserEmailAndParamUserIdMatch(id, email) {
    if(typeof id == "string") {
        id = Number(id);
    }

    const foundUser = await connection.all("SELECT * FROM users WHERE id = ? AND email = ?", [id, email]);

    return foundUser.length > 0;
}


const tryWithRefreshToken = async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    const userId = req.cookies.userId;
            
    if(refreshToken == null) { // hvis ingen refreshToken
        return res.sendStatus(401);
    }

     // leder efter refreshToken'en i db
    const refreshTokensFromDb = await connection.all(
        "SELECT * FROM user_refresh_tokens WHERE token = ?", 
        [refreshToken]
    );

    // hvis den IKKE er der
    if(refreshTokensFromDb.length < 1){
        // refreshToken som du sendte er ikke i db - så du har ikke access
        return res.redirect('/users/login');
    }

    // hvis den blev fundet i db - bekræft at refreshTokenet er valid
    jwt.verify(refreshToken, process.env.USER_REFRESH_TOKEN_SECRET, async (error, user) => {
        if(error) {
            return res.redirect('/users/login');
        }

        // tjek om tokenen (som er der og er valid) er sendt fra samme bruge som der anmodes data om
        if(await doesTokenUserEmailAndParamUserIdMatch(userId, user.email) == true){

            // hvis den er valid og den rette brugers - så dan et nyt accesstoken, som returneres
            // {name: user.name} og IKKE bare user, fordi user-obj indeholder noget additional info
            const accessToken = generateAccessToken({email: user.email});
            const newRefreshToken = generateRefreshToken({email: user.email});

            res.cookie('accessToken', accessToken, {
                maxAge: 86_400_000,
                httpOnly: true,
            });

            res.cookie('refreshToken', newRefreshToken, {
                maxAge: 86_400_000,
                httpOnly: true,
            });

            // læg ny refreshToken i db
            connection.run("INSERT INTO user_refresh_tokens ('token') VALUES (?)", 
            [newRefreshToken]);
        
            // slet gamle refreshToken
            connection.run("DELETE FROM user_refresh_tokens WHERE token = ?", [refreshToken]);

            //req.user = user;
           next(); // kalder den callback som bliver givet med når vi kalder authenticateToken()-func
       } else { // useren med dette accessToken requester en anden users oplysninger
           return res.redirect('/users/login');
       }
    });
}

router.post("/api/users/loggedIn", async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if(refreshToken == null) {
        return res.json({ loggedIn: false });
    }

    // leder efter refreshToken'en i db
    const refreshTokensFromDb = await connection.all(
        "SELECT * FROM user_refresh_tokens WHERE token = ?", 
        [refreshToken]
    );

    // hvis den IKKE er der
    if(refreshTokensFromDb.length < 1){
        return res.json({ loggedIn: false });
    }

    // hvis den blev fundet i db - bekræft at refreshTokenet er valid
    jwt.verify(refreshToken, process.env.USER_REFRESH_TOKEN_SECRET, (error, user) => {
        if(error) {
            return res.json({ loggedIn: false });
        }
        return res.json({ loggedIn: true }); // der er valid refreshToken
    });
});

router.delete("/api/users/logout", async (req, res) => {
    await connection.run("DELETE FROM user_refresh_tokens WHERE token = ?", [req.cookies.refreshToken]);

    const tokenFromDb = await connection.all("SELECT * FROM user_refresh_tokens WHERE token = ?", [req.cookies.refreshToken]);

    if(tokenFromDb.length < 1){
        return res.sendStatus(200);
    }
    res.sendStatus(500);
})

function generateAccessToken(user){
    return jwt.sign(user, process.env.USER_ACCESS_TOKEN_SECRET, {expiresIn: '5s'});
}

function generateRefreshToken(user) {
    return jwt.sign(user, process.env.USER_REFRESH_TOKEN_SECRET, {expiresIn: '1d'});
}

export default {
    router, authenticateToken
};
