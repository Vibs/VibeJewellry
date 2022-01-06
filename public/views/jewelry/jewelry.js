const jewelryWrapper = document.getElementById("jewelry-wrapper");


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
    jewelryDiv.classList.add("col-xs-6", "col-sm-4", "jewelry-col");

    jewelryDiv.innerHTML = `
    <a class="jewelry-link" href="/jewelry/${escapeHTML(jewelry.id.toString(10))}">
        <img class="jewelry-image" alt="${escapeHTML(jewelry.name)}" src="/assets/images/jewelry/${escapeHTML(jewelry.image_path)}">

        <p class="name">${escapeHTML(jewelry.name)}<p>
        <p class="price"> ${escapeHTML(jewelry.price.toString(10))} dkk</p>
    </a>`;

    jewelryWrapper.appendChild(jewelryDiv);

}

