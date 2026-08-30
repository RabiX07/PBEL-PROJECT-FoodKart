import Admin from "../../model/Admin.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";



export const createAdmin = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    // Check if email already exists
    const exists = await Admin.findOne({ email });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Admin account already exists",
      });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({ fullName, email, password: hashedPassword, role });

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      adminId: admin._id,
    });
  } catch (error) {
    console.error("Create Admin Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};




export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    admin.lastLogin = new Date();
    await admin.save();

    const token = jwt.sign(
      {
        adminId: admin._id,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res
      .status(200)
      .cookie("adminToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        message: "Login successful",
        adminId: admin._id,
      });

  } catch (error) {
    console.error("Admin Login Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



// ==============================
// 3️⃣ GET ADMIN PROFILE (Protected)
// ==============================
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.adminId).select("-password");

    res.status(200).json({
      success: true,
      admin,
    });
  } catch (error) {
    console.error("Get Admin Profile Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
