import User from "../model/user.js";
import OTP from "../model/OTP.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import generateOTP from "../utils/OTPgenerator.js";
import mailSender from "../utils/mailSender.js";
import otpMail from "../templates/otpMail.js";

export const createUser = async (req, res) => {
  try {
    const { fullName, email, password, otp } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password

    const hashedPassword = await bcrypt.hash(password, 10);
    const nameParts = fullName.split(" ");
    const first = nameParts[0] || "";
    const second = nameParts[1] || "";

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      imgURL: `https://api.dicebear.com/9.x/initials/svg?seed=${first}%20${second}&radius=50`,
    });

    // verify otp before save

    const record = await OTP.findOne({ email }).sort({ createdAt: -1 });

    if (!record) {
      return res
        .status(400)
        .json({ success: false, message: "OTP not found or expired" });
    }

    if (record.otp !== Number(otp)) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    await OTP.deleteOne({ _id: record._id });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = jwt.sign(
      {
        userId: user._id,
        fullName: user.fullName,
        email: user.email,
        imgURL: user.imgURL,
      },
      process.env.JWT_SECRET,
      { expiresIn: "3d" },
    );
    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true, // prevents JS access (important for security)
        secure: true, // set true on HTTPS
        sameSite: "none",
        maxAge: 3 * 24 * 60 * 60 * 1000, // cookie validity
      })
      .json({
        success: true,
        message: "Login successful",
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const SendOpt = async (req, res) => {
  try {
    const { email } = req.body;

    console.log("Email received:", email);

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "email can't be empty",
      });
    }

    let newOTP;

    do {
      newOTP = generateOTP();
    } while (
      await OTP.findOne({
        email: email,
        otp: newOTP,
      })
    );

    // Save OTP
    const createOtp = await OTP.create({
      email,
      otp: newOTP,
    });

    console.log("OTP saved:", createOtp);

    console.log("ABOUT TO SEND EMAIL");

    const mailResponse = await mailSender(
      email,
      otpMail(newOTP),
      "Account Verification -- FoodKart",
    );

    console.log("EMAIL FUNCTION FINISHED");

    console.log("Mail response:", mailResponse);

    return res.status(200).json({
      success: true,
      message: "OTP sent to your mail successfully",
    });
  } catch (error) {
    console.error("Something went wrong while sending OTP:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
};
