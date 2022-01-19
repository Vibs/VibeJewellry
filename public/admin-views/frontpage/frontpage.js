const jewelryWrapper = document.getElementById("jewelry-wrapper");

fetch("/api/jewelry")
.then(response => response.json())
.then(jewelryList => jewelryList.forEach(jewelry => createJewelryView(jewelry)));

function createJewelryView(jewelry){
    const jewelryDiv = document.createElement('div');

    jewelryDiv.classList.add("jewelry-row", "align-vert-hor");

    jewelryDiv.innerHTML = `
    <div class="image">
    ${escapeHTML(jewelry.image_path) 
        ? `<img class="actual-image " alt="${escapeHTML(jewelry.name)}" src="/assets/images/jewelry/${escapeHTML(jewelry.image_path)}">`
        : `<img class="actual-image " alt="default_jewelry_image" src="/assets/images/default_jewelry.jpg">`
    }
    </div>
    <p class="name">${escapeHTML(jewelry.name)}</p>
    <p class="price"> ${escapeHTML(jewelry.price.toString(10))} dkk</p>
    <p class="stock"> ${escapeHTML(jewelry.stock.toString(10))}</p>
    <div class="actions-wrapper">
        <a href="admin/jewelry/edit/${escapeHTML(jewelry.id.toString(10))}" class="action edit-link">Rediger</a>
        <a href="admin/jewelry/delete/${escapeHTML(jewelry.id.toString(10))}" class="action delete-link">Slet</a>
    </div>
    `;

    jewelryWrapper.appendChild(jewelryDiv);
}


