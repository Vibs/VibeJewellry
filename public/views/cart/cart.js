const headline = document.getElementById('headline');
const jewelryWrapper = document.getElementById("jewelry-wrapper");

let userId = getCookie('userId');

fetch(`/users/${userId}/cartItems`, {
    method: 'GET', 
    headers: {
        'Accept': 'application/json'
    }
})
.then(response => {
    if(response.ok){
        return response.json();
    }else {
        throw new Error(`${response.status} ${response.statusText}`);
    }
})
.then(cartItems => {
    headline.innerText += ` (${cartItems.length} varer)`;
    cartItems.forEach(cartItem => createCartJewelryView(cartItem))
})
.catch(error => console.error('Error getting cart-items: ', error));


function createCartJewelryView(cartItem){
    console.log(cartItem);
    const jewelryDiv = document.createElement('div');

    jewelryDiv.classList.add("jewelry-row", "align-vert-hor");

    jewelryDiv.innerHTML = `

    <div class="row-item-wrapper">
        ${escapeHTML(cartItem.jewelry.image_path) 
            ? `<img class="image" alt="${escapeHTML(cartItem.jewelry.name)}" src="/assets/images/jewelry/${escapeHTML(cartItem.jewelry.image_path)}">`
            : `<img class="image" alt="default_jewelry_image" src="/assets/images/default_jewelry.jpg">`
        }

        <p class="name">${escapeHTML(cartItem.jewelry.name)}</p>
        <p class="price"> ${escapeHTML(cartItem.jewelry.price.toString(10))} dkk</p>
    
    </div>
    <div class="row-item-wrapper">
        hej
    </div>
    `;
    //   <p class="stock"> ${escapeHTML(jewelry.stock.toString(10))}</p> // under price

    jewelryWrapper.appendChild(jewelryDiv);
}


