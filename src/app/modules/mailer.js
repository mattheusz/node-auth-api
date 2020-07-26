const path = require("path");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const { host, port, user, pass } = require("../../config/mail.json");

const transport = nodemailer.createTransport({
    host,
    port,
    auth: {
        user,
        pass,
    },
});

// colocando o plugin do handlebars no nodemailer transport
transport.use(
    "compile",
    hbs({
        viewEngine: {
            extName: ".html",
            partialsDir: path.resolve("./src/resources/mail/"), // location of your subtemplates aka. header, footer etc
            layoutsDir: path.resolve("./src/resources/mail/"), // location of handlebars templates
            defaultLayout: "auth/forgot_password.html", // name of main template
        },
        viewPath: path.resolve("./src/resources/mail/"),
        extName: ".html",
    })
);

module.exports = transport;

/*

viewEngine : {
    extname: '.hbs', // handlebars extension
    layoutsDir: 'views/email/', // location of handlebars templates
    defaultLayout: 'template', // name of main template
    partialsDir: 'views/email/', // location of your subtemplates aka. header, footer etc
},

*/
