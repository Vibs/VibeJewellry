const headline = document.getElementById('headline');

// TODO overvej måske at slette fra cookie??
let username = getCookie('username');

if(username){
    if(username.indexOf(' ') > 0){
        username = username.substring(0, username.indexOf(" ")); // kun fornavn
    }
    username = username.charAt(0).toUpperCase() + username.substring(1);// stort forbogstav

    headline.innerText = headline.innerText + ", " + username;
}