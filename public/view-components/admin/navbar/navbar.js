const returnBtn = document.getElementById('return-btn');

returnBtn.addEventListener('click', returnToCustomerView);

function returnToCustomerView() {

    fetch("http://localhost:8080/admin/logout", {
        method: 'DELETE'
    })
    .then(response => {
        if(response.ok){
            window.location.replace("/");
        } else {
            throw new Error(`${response.status} ${response.statusText}`);
        }
    })
    .catch(error => {
        console.log("Error in logout", error);
        alert("Der skete en fejl da du forsøgte at logge ud");
    });
}


