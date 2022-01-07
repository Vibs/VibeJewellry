const submitButton = document.getElementById('submit-button');

submitButton.addEventListener('click', createJewelry);

const fileReader = new FileReader();
let base64;
let fileName;

fileReader.addEventListener("load", function (event) {
    base64 = event.target.result;
})

const imageInput = document.getElementById('imageInput');


function createBase64() {
    fileName = imageInput.files[0].name;
    fileReader.readAsDataURL(imageInput.files[0]);
}


function createJewelry() {
    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const stock = document.getElementById('stock').value;   

    if(name && price){
        const jewelry = {
            name: name,
            price: price,
            stock: stock ? stock : 0,
            base64: base64,
            fileName: fileName
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