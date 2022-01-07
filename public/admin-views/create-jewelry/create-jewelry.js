const submitButton = document.getElementById('submit-button');

submitButton.addEventListener('click', createJewelry);

const fileReader = new FileReader();
let base64;

fileReader.addEventListener("load", function (event) {
    base64 = event.target.result;
})

function createJewelry() {
    /*
    i stedet for at gemme felterne i varibaler udenfor functionen, så sætter jeg det indeni
    FORDI hvis det står udenfor, blvier initial load langsommere - det vil vi IKKE have
    desuden skal vi kun bruge felterne én gang
    */
    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const stock = document.getElementById('stock').value;
    const imageInput = document.getElementById('imageInput').files[0];

    fileReader.readAsDataURL(imageInput);

    if(name && price){
        const jewelry = {
            name: name,
            price: price,
            stock: stock ? stock : 0,
            base64: base64
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
                window.location.replace("/admin");
            } else {
                console.log("Error sending the contact message:", response.status);
                alert("Der skete en fejl med at oprette smykket");
            }
        })
    } else {
        alert("Du skal udfylde navn og pris, for at oprette et smykke");
    }

}