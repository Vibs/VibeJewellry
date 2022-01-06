import fs from "fs";


const customerNav = fs.readFileSync("./public/view-components/customer/navbar/navbar.html", "utf8");
const customerFooter = fs.readFileSync("./public/view-components/customer/footer/footer.html", "utf8");


const adminNav = fs.readFileSync("./public/view-components/admin/navbar/navbar.html", "utf8");
const adminFooter = fs.readFileSync("./public/view-components/admin/footer/footer.html", "utf8");


function createPage(path, options) {
    let mainPage;
    let nav;
    let footer;

    if(options?.admin){
        if(path){
            mainPage = fs.readFileSync(`./public/admin-views/${path}`, "utf8");
        }
        nav = adminNav;
        footer = adminFooter;
    }

    else if(path){
        mainPage = fs.readFileSync(`./public/views/${path}`, "utf8");
        nav = customerNav;
        footer = customerFooter;
    }

    return (nav + mainPage + footer)
        .replace("%%DOCUMENT_TITLE%%", options?.title || "VibeJewelry")
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
