let jewelryName;
const jewelryId = document.getElementById('current-jewelry-id').innerText;

fetch(`/api/jewelry/${jewelryId}`)
.then(response => response.json())
.then(jewelry => showOnPage(jewelry[0]))

const name = document.getElementById('name');
const price = document.getElementById('price');
const stock = document.getElementById('stock');

function showOnPage(jewelry) {
    jewelryName = jewelry.name;
    name.innerText = `Navn: ${jewelry.name}`;
    price.innerText = `Pris: ${jewelry.price}`;
    stock.innerText = `Lagerbeholdning: ${jewelry.stock}`;
}

const deleteButton = document.getElementById('delete-button');

deleteButton.addEventListener('click', deleteJewelry);

function deleteJewelry() {

    fetch(`/api/jewelry/${jewelryId}`, {
        method: 'DELETE',
        headers: {
        'Content-Type': 'application/json; charset=UTF-8' // denne linje siger at dataen som vi sender er en string 
        }
    })
    .then(response => {
        if(response.status === 200) {
            alert(`${jewelryName} er nu slettet`);

            // og så redirect til anden side
            window.location.replace("/admin");
        } else {
            console.log("Error deleting jewelry:", response.status);
            alert("Der skete en fejl med at slette smykket");
        }
    })
}