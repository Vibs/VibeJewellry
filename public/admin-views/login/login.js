const submitButton = document.getElementById('submit-button');

submitButton.addEventListener('click', logIn);

function logIn() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('pass').value;

    if(username && password){
        const adminUser = {
            username: username,
            password: password,
        }

        fetch("http://localhost:8080/login", {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json; charset=UTF-8', // denne linje siger at dataen som vi sender er en string 
            'Accept': 'application/json'
            },
            body: JSON.stringify(adminUser)
        })
        .then(response => {
            if (response.ok) {
                window.location.replace("/admin");
                //return response.json();
            } else {
                throw new Error(`${response.status} ${response.statusText}`);
            }
        })
        //.then(data => redirectToAdminFrontpage(data))
        .catch((error) => {
            console.error('Logging in: ', error);
        });
    } else {
        alert("Indtast brugernavn og adgangskode");
    }
}


/*
function redirectToAdminFrontpage(data) {
    console.log("handleNoget data i login.js:", data.accessToken);

    // lav ny fetch
    fetch("http://localhost:8080/admin", {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 
        'Authorization': `Bearer ${data.accessToken}`},
        credentials: 'include'
    })
    .then(response => {
        console.log("redirectToAdminFrontpage", response.status);
        if (response.ok) {
            console.log("Hej");
            return response.json();
        } else {
            throw new Error(`${response.status} ${response.statusText}`);
        }
    })
    .then(data => handleNoget(data)) /// TODO ændr i denne fetch - den er ens med den overnfor
    .catch((error) => {
        console.error('Logging in2: ', error);
    });

    
}
*/
