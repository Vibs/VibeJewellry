const jewelryWrapper = document.getElementById("jewelry-wrapper");

console.log("HEJ");


fetch("/api/jewelry")
.then(response => response.json())
.then(jewelryList => jewelryList.forEach(jewelry => createJewelryView(jewelry)));
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



function createJewelryView(jewelry){
    const jewelryDiv = document.createElement('div');

    jewelryDiv.classList.add("jewelry-row", "align-vert-hor");

    jewelryDiv.innerHTML = `
    <img class="image" alt="${escapeHTML(jewelry.name)}" src="/assets/images/jewelry/${escapeHTML(jewelry.image_path)}">
    <p class="name">${escapeHTML(jewelry.name)}</p>
    <p class="price"> ${escapeHTML(jewelry.price.toString(10))} dkk</p>
    <p class="stock"> ${escapeHTML(jewelry.stock.toString(10))}</p>
    <div class="actions-wrapper">
        <a href="admin/jewelry/edit/${escapeHTML(jewelry.id.toString(10))}" class="action">Rediger</a>
        <a href="admin/jewelry/delete/${escapeHTML(jewelry.id.toString(10))}" class="action">Slet</a>
    </div>
    `;

    jewelryWrapper.appendChild(jewelryDiv);

}


/*
function createJewelryView(jewelry){
    console.log(jewelry);

    const jewelryDiv = document.createElement('div');
    jewelryDiv.classList.add("col-xs-6", "col-sm-4", "jewelry-col");

    jewelryDiv.innerHTML = `
    <a class="jewelry-link" href="admin/jewelry/${escapeHTML(jewelry.id.toString(10))}">
        <img class="jewelry-image" alt="${escapeHTML(jewelry.name)}" src="/assets/images/jewelry/${escapeHTML(jewelry.image_path)}">

        <p class="name">${escapeHTML(jewelry.name)}<p>
        <p class="price"> ${escapeHTML(jewelry.price.toString(10))} dkk</p>
    </a>`;

    jewelryWrapper.appendChild(jewelryDiv);

}
*/

