const loggedOutDropdown = document.getElementById('loggedOutDropdown');
const loggedInDropdown = document.getElementById('loggedInDropdown');
const loggedOutCartLink = document.getElementById('loggedOutCartLink');
const loggedInCartLink = document.getElementById('loggedInCartLink');

const logOut = document.getElementById('logOut');

fetch("/api/users/loggedIn", {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json; charset=UTF-8', // denne linje siger at dataen som vi sender er en string 
    'Accept': 'application/json'
  }
})
.then(response => response.json())
.then(data => modifyUserDropdown(data));


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

function modifyUserDropdown(data) {
 
  if(data.loggedIn) {
    loggedInDropdown.hidden = false;
    loggedOutDropdown.hidden = true;
    /* TODO slet disse to
    loggedInCartLink.hidden = false;
    loggedOutCartLink.hidden = true;
    */

    /* TODO slet resten herinde fra!!
    const profileLink = document.getElementById('profileLink');
    const ordersLink = document.getElementById('ordersLink');
    const cartLink = document.getElementById('cartLink');

    profileLink.setAttribute("href", `/profile`);
    ordersLink.setAttribute("href", `/orders`);
    */
    // TODO slet loggedInCartLink.setAttribute("href", `/cart`);
  }
  
  /* TODO slet const userId = getCookie("userId");

  if (userId) {
    const profileLink = document.getElementById('profileLink');
    const ordersLink = document.getElementById('ordersLink');
    const cartLink = document.getElementById('cartLink');

    profileLink.setAttribute("href", `/users/${userId}/profile`);
    ordersLink.setAttribute("href", `/users/${userId}/orders`);
    loggedInCartLink.setAttribute("href", `/users/${userId}/cart`);
  }
  */
}

// TODO slet
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

