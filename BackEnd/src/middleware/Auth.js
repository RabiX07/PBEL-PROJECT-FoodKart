import jwt from 'jsonwebtoken';

export const isLogin = (req, res, next) => {
    try {

        // console.log("========== AUTH DEBUG ==========");
        // console.log("Cookie header:", req.headers.cookie);
        // console.log("Parsed cookies:", req.cookies);

        const token = req.cookies.token;

        if (!token) {
            console.log("❌ NO TOKEN");
            return res.status(401).json({
                message: "Unauthorized: No token provided"
            });
        }

        // console.log("✅ TOKEN RECEIVED");

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;
        next();

    } catch (error) {
        console.error("Authentication error:", error);

        res.status(401).json({
            message: "Unauthorized: Invalid token"
        });
    }
};