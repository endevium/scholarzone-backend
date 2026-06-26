import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import "../controllers/reviewerController.js";
import { registerReviewer, loginReviewer } from "../controllers/reviewerController.js";

const router = express.Router();

router.post(
    "/reviewer/register",
    upload.fields([
        { name: "company_id", maxCount: 1 },
        { name: "certificate", maxCount: 1 },
        { name: "authorization", maxCount: 1 }
    ]),
    registerReviewer
);

router.post(
    "/reviewer/login",
    loginReviewer
);

export default router;