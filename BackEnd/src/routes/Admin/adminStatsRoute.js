import express from "express";

import { getAdminStats } from "../../controllers/Admin/adminStatsController.js";

import { isAdminLogin } from "../../middleware/AdminAuth.js";

const router = express.Router();


// Get admin dashboard statistics
router.get(
    "/",
    isAdminLogin,
    getAdminStats
);


export default router;