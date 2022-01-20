const loggedOutDropdown = document.getElementById('loggedOutDropdown');
const loggedInDropdown = document.getElementById('loggedInDropdown');

const logOut = document.getElementById('logOut');

fetch("/api/users/loggedIn", {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json; charset=UTF-8', // denne linje siger at dataen som vi sender er en string 
    'Accept': 'application/json'
  }
})
.then(response => response.json())
.then(data => {
  if(data.loggedIn) {
    loggedInDropdown.hidden = false;
    loggedOutDropdown.hidden = true;
  }
});


logOut.addEventListener("click", fetchLogOut);

function fetchLogOut() {
    fetch("/api/users/logout", {
        method: 'DELETE'
    })
    .then(response => {
        if(response.ok){
            alert("Du er nu logget ud");
            window.location.replace("/");
        } else {
            throw new Error(`${response.status}: ${response.statusText}`);
        }
    })
    .catch(error => console.log("Error logging out", error));
}

// bruges lige nu kun i profile.js til at hente brugernavn
function getCookie(cookieName) {
  const name = cookieName + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

