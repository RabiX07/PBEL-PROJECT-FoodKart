import cloudinary from "../config/cloudinary.js";
import fs from "fs";

export const uploadImageController = async (req, res) => {
  try {
    // Multer will store file temporarily → req.file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const filePath = req.file.path;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "FoodKart", // Change folder name if you want
    });

    // Delete temp file after upload
    fs.unlinkSync(filePath);

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);

    return res.status(500).json({
      success: false,
      message: "Image upload failed",
      error,
    });
  }
};
