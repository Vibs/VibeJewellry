const socket = io();

const chatsWrapper = document.getElementById('chatsWrapper');

fetch("/api/messages", {
    method: "GET",
    headers: {
        'Accept': 'application/json'
    }
})
.then(response => {
    if(response.ok){
        return response.json();
    } else {
        throw new Error("");
    }
})
.then(messageLists => Object.keys(messageLists).forEach(key => createChatWithMessages(messageLists[key])))
.catch(error => console.log(error));


function createChatWithMessages(messageList){
    const socketId = escapeHTML(messageList[0].socketId);

    // opretter chat-view og tilføjet til dom
    createChat(socketId);

 
    const convoWrapper = document.getElementById(`convoWrapper-${socketId}`);
    messageList.forEach(message => addMessage(convoWrapper, message));
}

function createChat(socketId) {
    const chat = document.createElement('div');
    chat.classList.add("chat", "col-xs-6", "col-sm-4");
    chat.id = `chat-${socketId}`;

    chat.innerHTML = `
        <div class="form-container">
            <h4>Chat</h4>
            <label for="msg"><b>${socketId}</b></label>

            <div id="convoWrapper-${socketId}" class="convoWrapper">
            </div>
            <textarea id="message-${socketId}" class="message" name="msg" placeholder="Skriv besked.."></textarea>

            <button id="sendButton-${socketId}" class="sendButton btn">Send</button>
            <button id="closeButton-${socketId}" class="closeButton btn" type="button">Luk</button>
        </div>
    `;
    // add til dom
    chatsWrapper.appendChild(chat);

    // fang elementer og lav eventListeners på dem
    const messageInput = document.getElementById(`message-${socketId}`);
    const sendButton = document.getElementById(`sendButton-${socketId}`);
    const deleteButton = document.getElementById(`closeButton-${socketId}`);

    sendButton.addEventListener('click', () => sendMessage(messageInput, socketId));
    deleteButton.addEventListener('click', () => deleteChat(socketId));
    
}

function addMessage(convoWrapper, message) {

    // 0 == customer, 1 == admin
    if(message.userType == 0) {
        showReceivedMessage(convoWrapper, message.message);
    } else {
        showOwnMessage(convoWrapper, message.message);
    }
    
}


function sendMessage(messageInput, socketId){
    //TODO her kunne man evt. tilføje et tjek på om brugeren er logget ind, så man kan gemme chatten
    const message = messageInput.value;

    if(message) {
        socket.emit("send-message-to-user", message, socketId) // send til server
    } else {
        alert("Indtast venligst en besked for at sende")
    }
}

socket.on("admin-message-sent-successfully", (message, socketId) => {showNewOwnMessage(message, socketId)});

socket.on("message-not-sent", (message) => {
    alert(message);
});

 // lytter til svar fra customer
socket.on("send-message-to-admin", (message, socketId) => showNewReceivedMessage(message, socketId));

// følgende 2 funks bruges ved oprettelse af chattene når de hentes i fetch
function showOwnMessage(convoWrapper, ownMessage) {
    const newMessage = document.createElement('div');
    newMessage.classList.add("message-wrapper");

    newMessage.innerHTML = `
        <div class="own-message message">${escapeHTML(ownMessage)}</div>
    `;

    convoWrapper.appendChild(newMessage);
}

function showReceivedMessage(convoWrapper, receivedMessage) {
    const newMessage = document.createElement('div');
    newMessage.classList.add("message-wrapper");

    newMessage.innerHTML = `
        <div class="received-message message">${escapeHTML(receivedMessage)}</div>
    `;

    convoWrapper.appendChild(newMessage);
}

// til 
function showNewOwnMessage(ownMessage, socketId) {
    const convoWrapper = document.getElementById(`convoWrapper-${socketId}`);
    const messageInput = document.getElementById(`message-${socketId}`);
    messageInput.value = "";

  
    const newMessage = document.createElement('div');
    newMessage.classList.add("message-wrapper");

    newMessage.innerHTML = `
        <div class="own-message message">${escapeHTML(ownMessage)}</div>
    `;

    convoWrapper.appendChild(newMessage);
}

function showNewReceivedMessage(receivedMessage, socketId) {
    let convoWrapper = document.getElementById(`convoWrapper-${socketId}`);

    if(!convoWrapper) {
        createChat(socketId);
        convoWrapper = document.getElementById(`convoWrapper-${socketId}`);
    }

    const newMessage = document.createElement('div');
    newMessage.classList.add("message-wrapper");

    newMessage.innerHTML = `
        <div class="received-message message">${escapeHTML(receivedMessage)}</div>
    `;

    convoWrapper.appendChild(newMessage);
}


function deleteChat(socketId) {
    fetch(`/api/messages/${socketId}`, {
        method: "DELETE"
    })
    .then(response => {
        if(response.ok){
            chatsWrapper.removeChild(document.getElementById(`chat-${socketId}`));
            alert("Chatten er nu slettet");
        } else {
            throw new Error("Error in deleting chat");
        }
    })
    .catch(error => console.log("Error in deleting chat", error));
}