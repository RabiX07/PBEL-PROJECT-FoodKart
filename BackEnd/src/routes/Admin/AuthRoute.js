import express from "express";
import { adminLogin, createAdmin, getAdminProfile } from "../../controllers/Admin/adminAuthController.js";
import { isAdminLogin, isSuperAdmin } from "../../middleware/AdminAuth.js";
import { isLogin } from "../../middleware/Auth.js";


const router = express.Router();


router.post("/create",isSuperAdmin, createAdmin);
router.post("/login", adminLogin);
router.get('/getprofile', isAdminLogin,  getAdminProfile);

export default router;