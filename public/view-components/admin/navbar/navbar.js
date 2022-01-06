const returnBtn = document.getElementById('return-btn');

returnBtn.addEventListener('click', returnToCustomerView);

function returnToCustomerView() {
    //TODO add logud fra admin-bruger

    window.location.replace("/");
}