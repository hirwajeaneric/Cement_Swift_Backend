const nodemailer = require('nodemailer');

const sendEmail = (recipient, subject, body) => {
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || "gmail",
        auth: {
            user: process.env.EMAIL_USER || "bousse200@gmail.com",
            pass: process.env.EMAIL_PASSWORD || "kwaa lxox wxfl vzbo"
        }
    });

    const mailOptions = {
        from: `"CEMENT SWIFT" <${process.env.EMAIL_USER}>`,
        to: recipient,
        subject: subject,
        text: body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

module.exports = sendEmail;