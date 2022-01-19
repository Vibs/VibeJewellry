
function escapeHTML(stringToEscape) {
    if(stringToEscape){
        if(typeof stringToEscape == "number") {
            stringToEscape = stringToEscape.toString(10);
        }
        if(typeof stringToEscape == "boolean") {
            stringToEscape = stringToEscape.toString();
        }
        stringToEscape = stringToEscape.replace("&", "&amp;");
        stringToEscape = stringToEscape.replace(">", "&gt;");
        stringToEscape = stringToEscape.replace("<", "&lt;");
        stringToEscape = stringToEscape.replace('"', "&quot;");
        stringToEscape = stringToEscape.replace("'", "&#039;");
    }
    return stringToEscape;
}

