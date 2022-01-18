import express from "express";
const messageRouter = express.Router();

import authRouter from "./auth/adminAuth.js";
import { connection } from "../database/connectSqlite.js";


messageRouter.get("/api/messages", authRouter.authenticateToken, async (req, res) => {
    try {
        const messages = await connection.all("SELECT * FROM messages");

        if(messages.length > 0) {
            /*
            {
                socketId: [{}, {}, {}],
                socketId: [{}, {}, {}],
            }
            */
            const messageList = {};

            messages.forEach(message => {
                const socketId = message.socketId;
          
                // hvis der allerede er et array til det socketId
                if(!(socketId in messageList)) {
                    // opret array 
                    messageList[socketId] = [];
                } 
                // tilføj til array
                messageList[socketId].push(message);
            });

            res.send(messageList);
        } else {
            res.send(messages);
        }
    } catch (error) {
        res.sendStatus(500);
    }
});

messageRouter.delete("/api/messages/:socketId", authRouter.authenticateToken, async (req, res) => {
    try {
        await connection.run("DELETE FROM messages WHERE socketId = ?", [req.params.socketId]);
        res.sendStatus(200);
    } catch {
        res.sendStatus(500);
    }
});

const messageFunctions = {
    saveUserMessage: saveUserMessage,
    saveAdminMessage: saveAdminMessage,
};

async function saveUserMessage(message, socketId) {
    try {
        await connection.run("INSERT INTO messages ('socketId', 'message', 'userType') VALUES (?, ?, ?)", [socketId, message, 0]);
        return true;
    } catch (error) {
        return false;
    }
}


async function saveAdminMessage(socketId, message) {
    try {
        await connection.run("INSERT INTO messages ('socketId', 'message', 'userType') VALUES (?, ?, ?)", [socketId, message, 1]);
        return true;
    } catch (error) {
        return false;
    }
}

export {
    messageRouter, messageFunctions
}