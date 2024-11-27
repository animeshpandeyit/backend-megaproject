import { Router } from "express";
import {
  registerUser,
  loginUser,
  logOutUser,
  getLoggedInUserInfo,
  refreshAccessToken,
  changeCurrentPassword,
  updateAccountDetails,
  updateUserAvatar,
  getUserChannelProfile,
  getWatchHistory,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

// protected routes
router.route("/logout").post(verifyJWT, logOutUser);
router.route("/loggenInUser").get(verifyJWT, getLoggedInUserInfo);
router.route("/refresh-token").post(refreshAccessToken);

router.route("/change-Password").post(verifyJWT, changeCurrentPassword);

router.route("/update-account-details").post(verifyJWT, updateAccountDetails);
router.route("/update-user-avatar").post(verifyJWT, updateUserAvatar);

router.route("/c/:username").get(verifyJWT, getUserChannelProfile);
router.route("/history").get(verifyJWT, getWatchHistory);

export default router;
