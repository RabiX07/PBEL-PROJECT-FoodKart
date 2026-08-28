import mongoose from 'mongoose';
import {mailSender} from '../utils/mailSender.js'
import otpMail from '../templates/otpMail.js'

const OTPschema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:Number,
        required:true,
        
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires: 5*60,
    }
});


const verificationMailSender = async (email,otp)=>{
           
          const mailResponse = await mailSender(email,otpMail(otp),"account verification -- FoodKart");
      return mailResponse;

}


OTPschema.pre('save', async function (next){
    // console.log('new doc save to DB');

    if(this.isNew){
        // console.log("in here mailsender call");
        //  issue was with arrow function wich dont bind "this"
        
      const mailRes =  await verificationMailSender(this.email,this.otp);
    //   console.log(mailRes);
      
    }
    
    next()
})


export default mongoose.model("OTP", OTPschema)