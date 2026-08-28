import nodemailer from "nodemailer";

const mailSender = async (email, body, subject) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: subject,
      html: body,
    };

    const info = await transporter.sendMail(mailOptions);

    return info;
  } catch (error) {
    console.error("Error sending mail:", error);
    throw error;
  }
};

export default mailSender;
