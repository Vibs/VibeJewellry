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

        fetch("/users/login", {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json; charset=UTF-8', // denne linje siger at dataen som vi sender er en string 
            'Accept': 'application/json'
            },
            body: JSON.stringify(user)
        })
        .then(response => {
            if (response.ok) {
                const userId = getCookie("userId");

                window.location.replace(`/users/${userId}/profile`);
            } else {
                throw new Error(`${response.status} ${response.statusText}`);
            }
        })
        .catch((error) => console.error('Logging in: ', error));
    } else {
        alert("Indtast brugernavn og adgangskode");
    }
}

