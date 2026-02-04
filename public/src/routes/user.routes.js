import {Router} from "express";
import {changeCurrentPassword, 
    getCurrentUser,
    getUserChannelProfile,
    getWatchhistory,
    loginUser,
    registerUser,
    updateUserAvtar,
    updateUsercoverImg} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { logoutUser } from "../controllers/user.controller.js";
import { refreshAccessToken } from "../controllers/user.controller.js";
const router = Router();

router.route("/Register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser)


router.route("/login").post(loginUser)  

// Secured Routes 
router.route("/logout").post(verifyJwt , logoutUser)
// Secoured ROutes

router.route("Access-Token").post(refreshAccessToken)
router.route("/change-password").post(verifyJwt , changeCurrentPassword)
router.route("/current-user").get(verifyJwt , getCurrentUser)
router.route("/avatar").patch(verifyJwt , upload.single("avatar"), updateUserAvtar)
router.route("/cover-image").patch(verifyJwt , upload.single("/coverImage"), updateUsercoverImg)
router.route("/c/:username").get(verifyJwt , getUserChannelProfile)
router.route("/history").get(verifyJwt , getWatchhistory)


export default router
