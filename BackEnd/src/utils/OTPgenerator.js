import otpGenerator from "otp-generator";


const generateOTP = () => {
    const otp = otpGenerator.generate(6,
            {   
                digits: true, 
                upperCaseAlphabets: false, 
                lowerCaseAlphabets: false,
                specialChars: false,
            }
        );
return otp;

}

export default generateOTP;