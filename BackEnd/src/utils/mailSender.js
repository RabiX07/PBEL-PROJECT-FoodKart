const mailSender = async (email, body, subject) => {
    try {
        console.log("Sending email through Brevo API...");

        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": process.env.BREVO_API_KEY
            },
            body: JSON.stringify({
                sender: {
                    name: "FoodKard",
                    email: process.env.MAIL_USER
                },
                to: [
                    {
                        email: email
                    }
                ],
                subject: subject,
                htmlContent: body
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("BREVO ERROR:", data);
            throw new Error(
                data.message || "Failed to send email through Brevo"
            );
        }

        console.log("Email sent successfully through Brevo:", data);

        return data;

    } catch (error) {
        console.error("MAIL ERROR:", error);
        throw error;
    }
};

export default mailSender;