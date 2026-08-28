import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,

    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,

    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

const mailSender = async (email, body, subject) => {
    try {
        console.log("mailSender started");
        console.log("MAIL_HOST:", process.env.MAIL_HOST);

        console.log("Calling sendMail...");

        const info = await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject,
            html: body
        });

        console.log("sendMail finished");

        return info;

    } catch (error) {
        console.error("MAIL ERROR:", error);
        throw error;
    }
};

export default mailSender;