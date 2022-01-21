
const submitButton = document.getElementById('submit-button');
const messageField = document.getElementById('text-message');

submitButton.addEventListener('click', sendContactMessage);

function sendContactMessage() {
    /*
    i stedet for at gemme felterne i varibaler udenfor functionen, så sætter jeg det indeni
    FORDI hvis det står udenfor, blvier initial load langsommere - det vil vi IKKE have
    desuden skal vi kun bruge felterne én gang
    */
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = messageField.value;

    console.log(`${name}, ${email}, ${message}`);

    if(name && email && message){
        const messageDetails = {
            name: name,
            email: email,
            message: message
        }

        fetch("/api/contact", {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json; charset=UTF-8' // denne linje siger at dataen som vi sender er en string 
            },
            body: JSON.stringify(messageDetails) // men siden vi sender JSON, så er vi er nødt til at lave det til en string via stringify
        })
        .then(response => {
            if(response.status === 200) {
                //Ja, I know den er grim puhaaa
                alert("Mail er sendt");

                // og så redirect til anden side
                window.location.replace("/");
                
            } else {
                console.log("Error sending the contact message:", response.status);
                alert("Der skete en fejl med at sende beskeden");
            }
        })
    } else {
        alert("Du skal udfylde alle felter, før du kan sende beskeden");
    }

}




