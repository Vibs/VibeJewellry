const submitButton = document.getElementById('submit-button');

submitButton.addEventListener('click', logIn);

function logIn() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('pass').value;

    if(email && password){
        const user = {
            email: email,
            password: password,
        }

        fetch("/api/users/login", {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json; charset=UTF-8', // denne linje siger at dataen som vi sender er en string 
            'Accept': 'application/json'
            },
            body: JSON.stringify(user)
        })
        .then(response => {
            if (response.ok) {
                window.location.replace("/profile");
            } else if(response.status == 400) {
                alert("Der findes ikke en bruger med denne email.");
                throw new Error(`${response.status} ${response.statusText}`);
            } else if(response.status == 403) {
                alert("Forkert adgangskode.");
                throw new Error(`${response.status} ${response.statusText}`);
            } else {
                alert("Der skete en fejl, da du forsøgte at logge ind");
            }
        })
        .catch((error) => console.error('Logging in: ', error));
    } else {
        alert("Indtast brugernavn og adgangskode");
    }
}

