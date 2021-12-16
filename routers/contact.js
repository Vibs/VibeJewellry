import express from "express";
const router = express.Router();

import nodemailer from "nodemailer";

router.post("/api/contact", (req, res) => {

    console.log("Hej fra api/contact");

    let status = 200;
    
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_NODEMAILER,
          pass: process.env.PASS_NODEMAILER,
        },
        tls:{
            rejectUnauthorized: false
        }
    });

    let mailToCustomer = {
        from: process.env.EMAIL_NODEMAILER, // sender address
        to: [req.body.email], // sender mail til brugers indtastede email
        subject: `Tak for din besked! `, // Subject line
        html: `Hej ${req.body.name}, <br>vi har modtaget din besked, og svarer snarest muligt.<br>` +
        `------------------------<br> Besked modtaget: <br>${req.body.message}` // plain text body
    }

    let mailToVibeJewelry = {
        from: process.env.EMAIL_NODEMAILER, // sender address
        to: [process.env.EMAIL], // sender mail til mig selv
        subject: `Kontaktformular fra ${req.body.email}`, // Subject line
        html: `Modtaget fra ${req.body.email} <br> ${req.body.message}`
    }

    const customerMailStatus = true;
    transporter.sendMail(mailToCustomer, function(error, success){
       if(error){
            console.log(error);
            customerMailStatus = false;
        }else{
            console.log("mailToCustomer gik godt :D");
        }
    });

    const vibeJewelryMailStatus = true;
    transporter.sendMail(mailToVibeJewelry, function(error, success){
        if(error){
            console.log(error);
            vibeJewelryMailStatus = false;
         }else{
             console.log("mailToVibeJewelry gik godt :D");
         }
     });

    res.sendStatus((customerMailStatus && vibeJewelryMailStatus) ? 200 : 500);
});



export default {
    router
};