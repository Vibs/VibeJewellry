import { connection } from "./database/connectSqlite.js";


const messageFunctions = {
    saveUserMessage: saveUserMessage,
    saveAdminMessage: saveAdminMessage,
    getAllMessages: getAllMessages


};

async function saveUserMessage(socketId, message) {
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

async function getAllMessages(socketId) {
    const messages = await connection.all("SELECT * FROM messages WHERE userId = ?", [socketId]);
    return messages;
}

export {
    messageFunctions
}