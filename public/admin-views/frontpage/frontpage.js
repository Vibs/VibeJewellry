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

    ${escapeHTML(jewelry.image_path) 
        ? `<img class="image" alt="${escapeHTML(jewelry.name)}" src="/assets/images/jewelry/${escapeHTML(jewelry.image_path)}">`
        : `<img class="image" alt="default_jewelry_image" src="/assets/images/default_jewelry.jpg">`
    }

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


