import User from "../model/user.js";
import uploadCloudinary from "../utils/cloudinary.js";
import bcrypt from "bcrypt";

export const getProfile = async (req, res) => {
    try {
        // If auth middleware failed or user is missing
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User not found",
            });
        }
       
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({   
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User profile fetched successfully",
            user,  /// need to inspected for security issues as all sensitive data is being sent
        });

    } catch (error) {
        console.error("Error fetching user profile:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};



export const updateProfilePicture = async (req, res) => {

    try {
        const { userId } = req.user;
        const newProfilePic = req.files.profilePic;


        if (!newProfilePic) {
            return res.status(400).json({
                success: false,
                message: "Profile picture is required",
            });
        }

        const userDetail = await User.findById(userId);

        if (!userDetail) {

            return res.status(404).json({
                success: false,
                message: "user not found",
            });

        };

        const uploadRes = await uploadCloudinary(newProfilePic, "UserProfileFolder", null, 70);

        const updateingDP = await User.findByIdAndUpdate(userId, {
            imgURL: uploadRes.secure_url
        }, { new: true });

        if (!updateingDP) {
            return res.status(404).json({
                success: false,
                message: "Failed to update profile picture, user not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "profile picture updated successfully",
            link: uploadRes.secure_url
        })
    } catch (error) {
        console.log("error at updateProfilePicture controller", error);

        return res.status(500).json({
            success: false,
            message: 'something went wrong while updateing the profile picture, please try again',
        });

    }
}



export const updateName = async (req, res) => {
    try {
        const { userId } = req.user;
        const { fullName } = req.body;  
        if (!fullName) {
            return res.status(400).json({
                success: false,
                message: "Full name is required",
            });
        }
        const updatedUser = await User.findByIdAndUpdate(userId, {
            fullName,
        }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Full name updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Error updating full name:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
}

export const updatePassword = async (req, res) => {
    try {
        const { userId } = req.user;    
        const { password } = req.body;  
        if (!password) {
            return res.status(400).json({
                success: false,
                message: "Password is required",
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const updatedUser = await User.findByIdAndUpdate(userId, {
            password: hashedPassword,
        }, { new: true });  
        if (!updatedUser) {
            return res.status(404).json({
                success: false, 
                message: "User not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Password updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Error updating password:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
}