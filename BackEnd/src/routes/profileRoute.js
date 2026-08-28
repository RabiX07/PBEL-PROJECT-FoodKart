import { isLogin } from "../middleware/Auth.js";
import { Router } from "express";
import { getProfile, updateProfilePicture, updateName, updatePassword } from "../controllers/profile.js";

const route = Router();

route.get("/profile", isLogin, getProfile);
route.post("/update-picture", isLogin, updateProfilePicture);
route.put("/update-name", isLogin, updateName);
route.put("/update-password", isLogin, updatePassword);

export default route;