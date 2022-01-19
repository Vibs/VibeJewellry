const socket = io();
const messageInput = document.getElementById('message');
const convoWrapper = document.getElementById('convoWrapper');

const openButton = document.getElementById('openButton');
const closeButton = document.getElementById('closeButton');
const sendButton = document.getElementById('sendButton');

openButton.addEventListener('click', openForm);
closeButton.addEventListener('click', closeForm);
sendButton.addEventListener('click', sendMessage);


function openForm() {
    document.getElementById("myForm").style.display = "block";
}  
function closeForm() {
    document.getElementById("myForm").style.display = "none";
}


function sendMessage(){
    //TODO her kunne man evt. tilføje et tjek på om brugeren er logget ind, så man kan gemme chatten
    const message = messageInput.value;

    if(message) {
        socket.emit("send-customer-message", message) // send til server
    }
}

socket.on("message-sent-successfully", showOwnMessage);

socket.on("message-not-sent", (message) => {
    alert(message);
});

 // lytter til svar fra admin
socket.on("send-message-to-customer", (message, socketId) => {
    if(socketId == socket.id) {
        showReceivedMessage(message, socketId);
    }
});

function showOwnMessage(ownMessage) {
    messageInput.value = "";

    const newMessage = document.createElement('div');
    newMessage.classList.add("message-wrapper");

    newMessage.innerHTML = `
        <div class="own-message message">${escapeHTML(ownMessage)}</div>
    `;

    convoWrapper.appendChild(newMessage);
}

function showReceivedMessage(receivedMessage) {
    const newMessage = document.createElement('div');
    newMessage.classList.add("message-wrapper");

    newMessage.innerHTML = `
        <div class="received-message message">${escapeHTML(receivedMessage)}</div>
    `;

    convoWrapper.appendChild(newMessage);
}