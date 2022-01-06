const jewelryWrapper = document.getElementById("jewelry-wrapper");

const jewelryId = document.getElementById('current-jewelry-id').innerText;



fetch(`/api/jewelry/${jewelryId}`)
.then(response => response.json())
.then(jewelryList => jewelryList.forEach(jewelry => createSingleJewelryView(jewelry)));
/*
    console.log(response);
    if(response.status === 200) {
        //Ja, I know den er grim puhaaa
        alert("Projektet blev oprettet");

        // og så redirect til anden side
        window.location.replace("/dashboard");
        
    } else {
        console.log("Error creatinh project:", response.status);
        alert("Der skete en fejl med at oprette projektet");
    }
})
*/


function createSingleJewelryView(jewelry){
    const jewelryDiv = document.createElement('div');
    jewelryDiv.classList.add("single-jewelry");

    jewelryDiv.innerHTML = `
        <img class="single-jewelry-image" alt="${escapeHTML(jewelry.name)}" src="/assets/images/jewelry/${escapeHTML(jewelry.image_path)}">

        <p class="name">${escapeHTML(jewelry.name)}<p>
        <p class="price"> ${escapeHTML(jewelry.price.toString(10))} dkk</p>

        ${jewelry.stock > 0 ?
            `<div id="sold-out" hidden class="button">Udsolgt</div>
            <button id="add-to-cart" class="button">Læg i kurv</button>`
            :
            `<div id="sold-out" class="button">Udsolgt</div>
            <button id="add-to-cart" hidden class="button">Læg i kurv</button>`
        }`;

    jewelryWrapper.appendChild(jewelryDiv);
    

    //så tilføj eventlistener på knap
    const addToCartButton = document.getElementById("add-to-cart");
    addToCartButton.addEventListener('click', addToCart(jewelryId));

}


function addToCart(jewelryId) {
    // + læg i cart
    // TODO noget user-logik
}
