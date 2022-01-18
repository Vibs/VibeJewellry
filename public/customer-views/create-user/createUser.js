const submitButton = document.getElementById('submit-button');

submitButton.addEventListener('click', createUser);

function createUser() {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const pass = document.getElementById('pass').value;   
    const passConf = document.getElementById('passConf').value;   


    if(username && email && pass && passConf){

        if(pass == passConf) {
            
            const user = {
                username: username,
                email: email,
                password: pass
            }

            fetch("/api/users", {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json; charset=UTF-8' // denne linje siger at dataen som vi sender er en string 
                },
                body: JSON.stringify(user) // men siden vi sender JSON, så er vi er nødt til at lave det til en string via stringify
            })
            .then(response => {
                if(response.ok) {
                    console.log("response in creating", response.json());
                    alert('Du er nu oprettet som bruger, log venligst ind');
                    // og så redirect til anden side
                    window.location.replace("/users/login");
                } else if(response.status === 409) {
                    alert("Der findes allerede en bruger med denne email.");
                } else {
                    alert("Der skete en fejl i brugeroprettelsen");
                }
                throw new Error(`${response.status} ${response.statusText}`);
            })
            .catch(error => {
                console.log("Error creating user", error);
            });
                
                
                
                /*else if(response.status === 409) {
                    alert("Der findes allerede en bruger med denne email.");
                } else {
                    console.log("Error creating user", response.status);
                    alert("Der skete en fejl i brugeroprettelsen");
                }
            });
                */
           
        } else {
            alert("Adganskoderne matcher ikke");
        }
    } else {
        alert("Udfyld venligst alle felter");
    }

}