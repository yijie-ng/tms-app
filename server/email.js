const nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "2c7bd9a8f2bf5b",
    pass: "754846d4a11766",
  },
});

let message = {
  from: "from-example@email.com",
  to: "to-example@email.com",
  subject: "Subject",
  text: "Hello SMTP Email",
  html: "<h1>Hello SMTP Email</h1>",
};

let mail = transporter.sendMail(message, (err, info) => {
  if (err) {
    console.log(err);
  } else {
    console.log(info);
  }
});

module.exports = {
    mail
};