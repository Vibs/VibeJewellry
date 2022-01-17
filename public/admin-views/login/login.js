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

        fetch("/admin/login", {
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
            } else if(response.status == 400) {
                alert("Der findes ikke en bruger med denne email.");
                throw new Error(`${response.status} ${response.statusText}`);
            } else if(response.status == 403) {
                alert("Forkert adgangskode.");
                throw new Error(`${response.status} ${response.statusText}`);
            }
        })
        .catch((error) => {
            console.error('Logging in: ', error);
        });
    } else {
        alert("Indtast brugernavn og adgangskode");
    }
}