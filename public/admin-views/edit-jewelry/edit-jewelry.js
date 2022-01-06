let currentJewelry;

const jewelryId = document.getElementById('current-jewelry-id').innerText;

fetch(`/api/jewelry/${jewelryId}`)
.then(response => response.json())
.then(jewelry => fillForm(jewelry[0]))

const nameInputField = document.getElementById('name');
const priceInputField = document.getElementById('price');
const stockInputField = document.getElementById('stock');



function fillForm(jewelry) {
    currentJewelry = jewelry;

    nameInputField.value = jewelry.name;
    priceInputField.value = jewelry.price;
    stockInputField.value = jewelry.stock;
}

const submitButton = document.getElementById('submit-button');

submitButton.addEventListener('click', createJewelry);

function createJewelry() {
    const nameInput = nameInputField.value;
    const priceInput = priceInputField.value;
    const stockInput = stockInputField.value;

    // hvis der ER noget i de 2 felter
    if(nameInput && priceInput){
        // hvis én af værdierne har ændret sig
        if(nameInput != currentJewelry.name || priceInput != currentJewelry.price || stockInput != currentJewelry.stock){

            const updatedJewelry = {
                name: nameInput,
                price: priceInput,
                stock: stockInput
            }

            fetch(`/api/jewelry/${jewelryId}`, {
                method: 'PATCH',
                headers: {
                'Content-Type': 'application/json; charset=UTF-8' // denne linje siger at dataen som vi sender er en string 
                },
                body: JSON.stringify(updatedJewelry) // men siden vi sender JSON, så er vi er nødt til at lave det til en string via stringify
            })
            .then(response => {
                if(response.status === 200) {
                    alert(`${nameInput} er nu gemt`);

                    // og så redirect til anden side
                    window.location.replace("/admin");
                } else {
                    console.log("Error updating the jewelry:", response.status);
                    alert("Der skete en fejl med at opdatere smykket");
                }
            })
        } else {
            alert("Du har ikke lavet nogen ændringer");
        }
    } else {
        alert("Du skal udfylde navn og pris, for at oprette et smykke");
    }

}