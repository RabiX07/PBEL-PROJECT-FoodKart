import jwt from "jsonwebtoken";
import Admin from "../model/Admin.js";

export const isSuperAdmin = async (req, res, next) => {
    try {
        const token = req.cookies.adminToken || req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: No token provided",
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await Admin.findById(decoded.adminId);
        if (admin.role !== "superadmin") {    
            return res.status(403).json({
                success: false,
                message: "Forbidden: Insufficient privileges",
            });
        }
        next();
    } catch (error) {
        console.error("SuperAdmin Auth Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const isAdminLogin  = async (req, res, next) => {
    try {
        const token = req.cookies.adminToken || req.headers.authorization?.split(" ")[1];
            
        // console.log(token   , "------------------>>")
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: No token provided",
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = {
            adminId: decoded.adminId,
            role: decoded.role,
        };
        next();
    } catch (error) {
        console.error("Admin Auth Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};