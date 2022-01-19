const headline = document.getElementById('headline');
const jewelryWrapper = document.getElementById("jewelry-wrapper");

const userId = getCookie('userId');

fetch(`/api/users/${userId}/cartItems`, {
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
    const amountOfItems = cartItems.length;
    if(amountOfItems == 0) {
        headline.innerText = "Der er intet i din indkøbskurv endnu";
    } /*else {
        headline.innerText += `(${amountOfItems} varer)`;
    }*/
    cartItems.forEach(cartItem => createCartJewelryView(cartItem));
})
.catch(error => console.error('Error getting cart-items: ', error));


function createCartJewelryView(cartItem){
    const jewelryDiv = document.createElement('div');

    jewelryDiv.classList.add("jewelry-row", "align-vert-hor");

    jewelryDiv.innerHTML = `

    <div class="row-item-wrapper image">
        ${escapeHTML(cartItem.jewelry.image_path) 
            ? `<img class="actual-image" alt="${escapeHTML(cartItem.jewelry.name)}" src="/assets/images/jewelry/${escapeHTML(cartItem.jewelry.image_path)}">`
            : `<img class="actual-image" alt="default_jewelry_image" src="/assets/images/default_jewelry.jpg">`
        }
    
    </div>
    <div class="row-item-wrapper align-left">
        <p>${escapeHTML(cartItem.jewelry.name)}</p>
        <p> ${escapeHTML(cartItem.jewelry.price)} dkk</p>
       
    </div>
    <div class="row-item-wrapper">
        ${ escapeHTML((cartItem.jewelry.stock == 0))
            ? `<p class="sold-out">Udsolgt</p>`
            : `<select id="amountSelect-${escapeHTML(cartItem.id)}" onchange="updateCartItemAmount(this, ${escapeHTML(cartItem.id)})"></select>
            <p class="total"> ${escapeHTML((cartItem.jewelry.price * cartItem.amount))} dkk</p>
            <i id="remove-${escapeHTML(cartItem.id)}" class="fas fa-trash-alt remove"></i>`
        }
    </div>
    `;
    jewelryWrapper.appendChild(jewelryDiv);

    // hvis ikke udsolgt
    if(cartItem.jewelry.stock != 0) {
        // tilføj options til select
        addOptionsToSelect(cartItem);

        // tilføj eventlistener til options

    }
}


function addOptionsToSelect(cartItem) {
    const select = document.getElementById(`amountSelect-${cartItem.id}`);
    let highestSelect = 10;

    if(cartItem.jewelry.stock < 10) {
        highestSelect = cartItem.jewelry.stock;
    }

    for(let i = 1; i <= highestSelect; i++) {
        // lav nyt option-el
        const newOption = document.createElement('option');

        //tilføj det til select
        newOption.value = i;
        newOption.innerText = i;

        // hvis det er den der skal være selected
        if(cartItem.amount == i) {
            newOption.selected = true;
        }
        
        select.appendChild(newOption);
    }

}

function updateCartItemAmount(select, cartItemId) {
    console.log(`select: ${select.value}, cartItemId: ${cartItemId}`);
    

}

