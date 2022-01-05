import fs from "fs";


const nav = fs.readFileSync("./public/view-components/navbar/navbar.html", "utf8");
const footer = fs.readFileSync("./public/view-components/footer/footer.html", "utf8");


function createPage(path, options) {
    let mainPage;

    if(path){
        mainPage = fs.readFileSync(`./public/views/${path}`, "utf8");
    }


    return (nav + mainPage + footer)
        .replace("%%DOCUMENT_TITLE%%", options?.title || "Nodefolio")
        .replace("%%SCRIPT%%", options?.script ? options.script.map(createScript) : "")
        .replace("%%STYLING%%", options?.styling ? options.styling.map(createStylingLink) : "")//`<link rel="stylesheet" href="/views/${options.styling}"></script>` : "")
        .replace("%%ACTIVE_NAV_LINK%%", options?.activeNavLink);
}


function createStylingLink(styling){
    return `<link rel="stylesheet" href="${styling.href}">`;
}

function createScript(script){
    return `<script src="${script.src}"></script>`;
}

export {
    createPage
};
