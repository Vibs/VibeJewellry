console.log("Hej fra chat.js");

const socket = io();
console.log(socket);
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
    //TODO her kunne man evt. tilføje et tjek på om brugeren er logget ind
    // hvis brugeren er logget ind, kan man gemme chatten
    const message = messageInput.value;

    if(message) {
        socket.emit("send-customer-message", message)
    }
    console.log("front: ", socket.id);

    // send til server
   
}

console.log("front:", socket);

socket.on("message-sent-successfully", showOwnMessage);


 // lytter til svar fra admin
socket.on("send-admin-message", showReceivedMessage);


function showOwnMessage(ownMessage) {
    const newMessage = document.createElement('div');
    newMessage.classList.add("message-wrapper");

    newMessage.innerHTML = `
        <div class="own-message message">${escapeHTML(ownMessage)}</div>
    `;

    convoWrapper.appendChild(newMessage);
}
   

socket.on("message-not-sent", (message) => {
    alert(message);
});





function showReceivedMessage(receivedMessage) {

}