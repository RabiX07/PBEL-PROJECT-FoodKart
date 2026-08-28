import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import Admin from "./model/Admin.js";
import dns from 'node:dns';
dns.setServers(["1.1.1.1", "8.8.8.8"]);


 dotenv.config()

const seedSuperAdmin = async () => {

   console.log(process.env.DATABASE_URL)

  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DATABASE_URL);

    console.log("MongoDB connected");

    const email = "SuperAdmin@admin.com";
    const password = "SuperAdmin@123";

    // Check if superadmin already exists
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      console.log("Admin with this email already exists.");

      await mongoose.connection.close();
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create superadmin
    const superAdmin = await Admin.create({
      fullName: "Super Admin",
      email: email,
      password: hashedPassword,
      role: "superadmin",
      imgURL: "",
    });

    console.log("=================================");
    console.log("Super Admin created successfully!");
    console.log("=================================");
    console.log("ID:", superAdmin._id);
    console.log("Name:", superAdmin.fullName);
    console.log("Email:", superAdmin.email);
    console.log("Role:", superAdmin.role);
    console.log("Password:", password);
    console.log("=================================");

    await mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error("Error creating superadmin:", error);

    await mongoose.connection.close();
    process.exit(1);
  }
};

seedSuperAdmin();