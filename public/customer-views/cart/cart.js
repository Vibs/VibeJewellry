
const headline = document.getElementById('headline');
const jewelryWrapper = document.getElementById("jewelry-wrapper");

// TODO slet denne!!!!!
//const userId = getCookie('userId');
let totalPrice = 0;
let totalAmountOfCartItems = 0;

fetch("/api/cartItems", { // TODO slet `/api/users/${userId}/cartItems`, {
    method: 'GET', 
    headers: {
        'Accept': 'application/json'
    },
    credentials: 'include'
})
.then(response => {
    if(response.ok){
        return response.json();
    }else {
        throw new Error(`${response.status} ${response.statusText}`);
    }
})
.then(cartItems => {
    console.log("cartItems", cartItems);
    const amountOfItems = cartItems.length;
    if(amountOfItems == 0) {
        updateHeadlineEmptyCart();
    } else {
        cartItems.forEach(cartItem => createCartJewelryView(cartItem));
        updateHeadlineWithAmount();

        addTotalPrice();
    }
})
.catch(error => console.error('Error getting cart-items: ', error));


async function createCartJewelryView(cartItem){
    // variable som skal bruges til at vise totalprice og antal varer i senere funks
    if(cartItem.jewelry.stock != 0) {
        totalPrice += cartItem.jewelry.price * cartItem.amount;
        totalAmountOfCartItems += cartItem.amount;
    }
   

    const jewelryDiv = document.createElement('div');
    jewelryDiv.id = `jewelryRow-${escapeHTML(cartItem.id)}`;

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
            ? `<p class="sold-out">Udsolgt</p> <i id="removeSoldOut-${escapeHTML(cartItem.id)}" class="fas fa-trash-alt remove-sold-out"></i>`
            : `<select id="amountSelect-${escapeHTML(cartItem.id)}"></select>
            <div class="sub-total">
                <p id="subTotal-${escapeHTML(cartItem.id)}">${escapeHTML((cartItem.jewelry.price * cartItem.amount))}</p>
                <p>dkk</p>
            </div>
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
        const select = document.getElementById(`amountSelect-${cartItem.id}`);

        select.addEventListener('change', (event) => updateCartItemAmount(event, cartItem));
            // tilføj 
        const removeIcon = document.getElementById(`remove-${cartItem.id}`);
        removeIcon.addEventListener('click', () => removeCartItem(cartItem));
    } else {
        const removeIcon = document.getElementById(`removeSoldOut-${cartItem.id}`);
        removeIcon.addEventListener('click', () => {
            $(`#jewelryRow-${cartItem.id}`).fadeOut(500, () => { $(this).remove() });
        });
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

        newOption.value = i;
        newOption.innerText = i;

        // hvis det er den der skal være selected
        if(cartItem.amount == i) {
            newOption.selected = true;
        }
        select.appendChild(newOption);
    }
}

function updateCartItemAmount(event, cartItem) {
    const newAmount = event.target.value;
    const oldAmount = cartItem.amount;
    const jewelryPrice = cartItem.jewelry.price;

    const amount = { 
        amount: newAmount,
    }

    fetch(`/api/cartItems/${cartItem.id}`, {// TODO slet: `/api/users/${userId}/cartItems/${cartItem.id}`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(amount)
    })
    .then(response => {
        if(response.ok) {
            // opdater cartItem-obj
            cartItem.amount = newAmount;

            // opdater subTotal
            const subTotal = document.getElementById(`subTotal-${cartItem.id}`);
            subTotal.innerText = `${(newAmount * jewelryPrice).toString(10)}`;

            // opdater totalPrice 
            const amountDif = newAmount - oldAmount;
            const priceDifference = amountDif * jewelryPrice;
            updateTotalPrice(priceDifference);

            // opdater antal i headline
            totalAmountOfCartItems += amountDif;
            updateHeadlineWithAmount();
        } else {
            select.value = oldAmount;
            throw new Error("Error in changing amount on cartItem");
        }
    })
    .catch(error => console.log(error));
}

function addTotalPrice() {
    const totalPriceDiv = document.createElement('div');
    totalPriceDiv.id = "totalPriceRow";
    totalPriceDiv.classList.add("align-vert-hor");

    totalPriceDiv.innerHTML = `
    <div class="row-item-wrapper"></div>
    <div class="row-item-wrapper"></div>
    <div class="row-item-wrapper">
        <div id="totalPriceWrapper">
            <p id="totalPrice">${escapeHTML(totalPrice)}</p>
            <p>dkk</p>
        </div>
    </div>
    `;

    jewelryWrapper.appendChild(totalPriceDiv);
}

function updateTotalPrice(priceDifference) {
    const totalPriceDiv = document.getElementById('totalPrice');
    const currentPrice = Number(totalPriceDiv.innerText);

    totalPriceDiv.innerText = currentPrice + priceDifference;
}

function updateHeadlineWithAmount() {
    headline.innerText = `Din indkøbskurv (${totalAmountOfCartItems} varer)`;
}

function updateHeadlineEmptyCart() {
    headline.innerText = "Der er intet i din indkøbskurv endnu";
}

function removeCartItem(cartItem) {

    fetch(`/api/cartItems/${cartItem.id}`, { // TODO slet`/api/users/${userId}/cartItems/${cartItem.id}`, {
        method: "DELETE", 
        credentials: 'include'
    })
    .then(response => {
        if(response.ok) {
            // fjern fra view
            $(`#jewelryRow-${cartItem.id}`).fadeOut(500, () => { $(this).remove() });

            // opdater pris
            updateTotalPrice(-(cartItem.amount * cartItem.jewelry.price));

            // opdater headline
            totalAmountOfCartItems -= cartItem.amount;
            if(totalAmountOfCartItems > 0) {
                updateHeadlineWithAmount();
            } else {
                updateHeadlineEmptyCart();
                document.getElementById('totalPriceRow').remove();
            }
            
            cartItem = undefined;
        } else {
            alert("Der skete en fejl, da du forsøgte at fjerne varen fra din indkøbskurv.");
        }
    })
}