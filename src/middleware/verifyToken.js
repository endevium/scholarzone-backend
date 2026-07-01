import jwt from "jsonwebtoken";

import ReviewerToken from "../models/tokens/reviewerToken.js";

const tokenModels = {
    reviewer: ReviewerToken
};

export const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // Check if the request has an auth header
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "No token provided"
            });
        };

        const token = authHeader.split(" ")[1];

        // Check if the request contains a token
        if (!token) {
            return res.status(403).json({
                message: "Invalid token format"
            });
        };

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check the role of the user
        const tokenModel = tokenModels[decoded.role];

        if (!tokenModel) {
            return res.status(401).json({
                message: "Invalid role"
            });
        };

        const record = await tokenModel.findByToken(token);

        // Check if the token is still valid
        if (!record) {
            return res.status(401).json({
                message: "Expired or invalid token"
            });
        };

        req.user = decoded;
        next();
    }
    catch (e) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
};