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
        .replace("%%SCRIPT%%", options?.script ? `<script src="${options.script}"></script>` : "")
        .replace("%%STYLE%%", options?.styling ? `<link rel="stylesheet" src="${options.styling}"></script>` : "")
        .replace("%%ACTIVE_NAV_LINK%%", options?.activeNavLink);
}



export {
    createPage
};
