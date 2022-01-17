import fs from "fs";

const customerNav = fs.readFileSync("./public/view-components/customer/navbar/navbar.html", "utf8");
const customerFooter = fs.readFileSync("./public/view-components/customer/footer/footer.html", "utf8");
const customerChat = fs.readFileSync("./public/view-components/customer/chat/chat.html", "utf8");


const adminNav = fs.readFileSync("./public/view-components/admin/navbar/navbar.html", "utf8");
const adminFooter = fs.readFileSync("./public/view-components/admin/footer/footer.html", "utf8");

const customerPages = {
    loginPage: createCustomerPage("login/login.html", {
        title: "Log ind",
        script: [{ src: "/views/login/login.js" }],
    }),
    createUserPage: createCustomerPage("create-user/createUser.html", {
        title: "Log ind",
        script: [{ src: "/views/create-user/createUser.js" }],
    }),
    profilePage: createCustomerPage("profile/profile.html", {
        title: "Profil",
        script: [{ src: "/views/profile/profile.js" }],
    }),
    frontpage: createCustomerPage("frontpage/frontpage.html", {
        title: "Hjem",
        styling: [{ href: "/views/frontpage/frontpage.css" }]
    }),
    preLogInCartPage: createCustomerPage("cart/prelogin-cart.html", {
        title: "Indkøbskurv",
    }),
    contactPage: createCustomerPage("contact/contact.html", {
        title: "Kontakt",
        script: [{ src: "/views/contact/contact.js" }],
        styling: [{ href: "/views/contact/contact.css"}]
    }),
    cartPage:createCustomerPage("cart/cart.html", {
        title: "Indkøbskurv",
        script: [{ src: "/views/cart/cart.js" }],
        styling: [{ href: "/views/cart/cart.css"}]
    }),
    allJewelryPage: createCustomerPage("jewelry/jewelry.html", {
        title: "Smykker",
        script: [{ src: "/views/jewelry/jewelry.js" }],
        styling: [{ href: "/views/jewelry/jewelry.css"}]
    }),
    singleJewelryPage: createCustomerPage("single-jewelry/singleJewelry.html", {
        title: "Smykker",
        script: [{ src: "/views/single-jewelry/singleJewelry.js"}],
        styling: [{ href: "/views/single-jewelry/singleJewelry.css" }],
    })
}

const adminPages = {
    loginPage: createAdminPage("login/login.html", {
        admin: true,
        excludeNavbar: true,
        title: "Login",
        styling: [{ href: "/admin-views/login/login.css"}, 
        {href: "/admin-views/global-admin.css"}],
        script: [{ src: "/admin-views/login/login.js"}]
    }),
    frontpage: createAdminPage("frontpage/frontpage.html", {
        admin: true,
        title: "Alle smykker",
        styling: [{ href: "/admin-views/frontpage/frontpage.css"}, 
        {href: "/admin-views/global-admin.css"}],
        script: [{ src: "/admin-views/frontpage/frontpage.js"}]
    }),
    create:createAdminPage("create-jewelry/create-jewelry.html", {
        admin: true,
        title: "Opret",
        styling: [{ href: "/admin-views/create-jewelry/create-jewelry.css"}, 
        {href: "/admin-views/global-admin.css"}],
        script: [{ src: "/admin-views/create-jewelry/create-jewelry.js"}]
    }),
    editPage:createAdminPage("edit-jewelry/edit-jewelry.html", {
        admin: true,
        title: "Rediger",
        styling: [{ href: "/admin-views/edit-jewelry/edit-jewelry.css"}, 
        {href: "/admin-views/global-admin.css"}],
        script: [{ src: "/admin-views/edit-jewelry/edit-jewelry.js"}],
    }),
    deletePage: createAdminPage("delete-jewelry/delete-jewelry.html", {
        admin: true,
        title: "Slet",
        styling: [{ href: "/admin-views/delete-jewelry/delete-jewelry.css"}, 
        {href: "/admin-views/global-admin.css"}],
        script: [{ src: "/admin-views/delete-jewelry/delete-jewelry.js"}],
    })
}


function createCustomerPage(path, options) {
    const nav = customerNav;
    const footer = customerFooter;
    let mainPage;

    path ? mainPage = fs.readFileSync(`./public/views/${path}`, "utf8") : mainPage = ""

    return (nav + customerChat + mainPage + footer)
        .replace("%%DOCUMENT_TITLE%%", options?.title || "VibeJewelry")
        .replace("%%SCRIPT%%", options?.script ? options.script.map(createScript) : "")
        .replace("%%STYLING%%", options?.styling ? options.styling.map(createStylingLink) : "")//`<link rel="stylesheet" href="/views/${options.styling}"></script>` : "")
        .replace("%%ACTIVE_NAV_LINK%%", options?.activeNavLink);
}

function createAdminPage(path, options) {
    const nav = options?.excludeNavbar ? "" : adminNav;
    const footer = adminFooter;
    let mainPage;

    if(path) {
        mainPage = fs.readFileSync(`./public/admin-views/${path}`, "utf8");
    }

    return (nav + mainPage + footer)
        .replace("%%DOCUMENT_TITLE%%", options?.title || "VibeJewelry")
        .replace("%%SCRIPT%%", options?.script ? options.script.map(createScript) : "")
        .replace("%%STYLING%%", options?.styling ? options.styling.map(createStylingLink) : "")//`<link rel="stylesheet" href="/views/${options.styling}"></script>` : "")
        .replace("%%ACTIVE_NAV_LINK%%", options?.activeNavLink);
}



function createStylingLink(styling) {
    return `<link rel="stylesheet" href="${styling.href}">`;
}

function createScript(script) {
    return `<script src="${script.src}"></script>`;
}

export {
    createAdminPage, customerPages, adminPages
};
