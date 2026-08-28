import nodemailer from "nodemailer"
// import dotenv from "dotenv"

// dotenv.config()


export const mailSender = async (email,body,subject)=>{
    try{
       const transporter = nodemailer.createTransport({
        host:process.env.MAIL_HOST,
        auth:{     
            user:process.env.MAIL_USER,
            pass:process.env.MAIL_PASS
        }
       });

       const mailOptions = {
        from: 'dev.test.dt007@gmail.com',
        to: `${email}`, 
        subject: `${subject}`, 
        html: `${body}`, 
       };

       await  transporter.sendMail(mailOptions);

    //    console.log(info);
    





    }catch(error){
        console.log('something went wrong while sending verification mail', error);
        
    }
}