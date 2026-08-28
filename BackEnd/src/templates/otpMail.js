


const mailTemplate = (otp)=>{return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f9;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background-color: #4CAF50;
            color: #ffffff;
            text-align: center;
            padding: 20px;
            font-size: 24px;
        }
        .content {
            padding: 20px;
            text-align: center;
        }
        .otp {
            font-size: 28px;
            font-weight: bold;
            color: #4CAF50;
            margin: 20px 0;
        }
        .footer {
            background-color: #f4f4f9;
            text-align: center;
            padding: 10px;
            font-size: 12px;
            color: #888;
        }
        .button {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            font-size: 16px;
            color:rgb(18, 17, 17);
            background-color:rgb(232, 236, 20);
            text-decoration: none;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            OTP Verification - From FoodKart
        </div>
        <div class="content">
            <div class="button">FoodKart</div> 
            <p>Hello,</p>
            <p>Thank you for using our service. Please use the following One-Time Password (OTP) to verify yout email:</p>
            <div class="otp">${otp}</div>
            <p>The OTP is valid for the next 5 minutes.</p>
           
        </div>
        <div class="footer">
            If you did not request this, please ignore this email.
        </div>
    </div>

    
</body>
</html>
`}

export default mailTemplate;