const submitButton = document.getElementById('submit-button');

submitButton.addEventListener('click', createJewelry);

function createJewelry() {
    /*
    i stedet for at gemme felterne i varibaler udenfor functionen, så sætter jeg det indeni
    FORDI hvis det står udenfor, blvier initial load langsommere - det vil vi IKKE have
    desuden skal vi kun bruge felterne én gang
    */
    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const stock = document.getElementById('stock').value;

    if(name && price){
        const jewelry = {
            name: name,
            price: price,
            stock: stock ? stock : 0
        }

        fetch("/api/jewelry", {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json; charset=UTF-8' // denne linje siger at dataen som vi sender er en string 
            },
            body: JSON.stringify(jewelry) // men siden vi sender JSON, så er vi er nødt til at lave det til en string via stringify
        })
        .then(response => {
            if(response.status === 200) {
                alert(`${name} er nu oprettet`);

                // og så redirect til anden side
                window.location.replace("/");
            } else {
                console.log("Error sending the contact message:", response.status);
                alert("Der skete en fejl med at oprette smykket");
            }
        })
    } else {
        alert("Du skal udfylde navn og pris, for at oprette et smykke");
    }

}