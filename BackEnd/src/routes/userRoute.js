import express from "express"

import {SendOpt, createUser , loginUser} from '../controllers/auth.js'

const route = express.Router();

route.post('/signup',createUser)

route.post('/sendotp', SendOpt)

route.post('/login',loginUser)

route.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "none",
    secure: true
  });

  return res.json({ success: true, message: "Logged out successfully." });
});



export default route