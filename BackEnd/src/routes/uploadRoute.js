import express from "express";
import multer from "multer";
import { uploadImageController } from "../controllers/uploadImageController.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/image", upload.single("image"), uploadImageController);

export default router;
