import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { registerReviewer, loginReviewer, verifyReviewerOTP, completeProfile } from "../controllers/reviewerController.js";

const router = express.Router();

router.post(
    "/reviewer/register",
    registerReviewer
);

router.post(
    "/reviewer/login",
    loginReviewer
);

router.post(
    "/reviewer/verify-otp",
    verifyReviewerOTP
);

router.post(
    "/reviewer/complete-profile",
    upload.fields([
        { name: "company_id", maxCount: 1 },
        { name: "certificate", maxCount: 1 },
        { name: "authorization", maxCount: 1 }
    ]),
    completeProfile
)

export default router;