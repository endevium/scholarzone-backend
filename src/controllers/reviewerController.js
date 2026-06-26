import Reviewer from "../models/reviewer.js";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";
import { deleteUploadedFiles } from "../utils/fileUtils.js";

// For reviewer (web) registration
export const registerReviewer = async (req, res) => {
    // Check for any missing required fields
    const fields = [
        "email",
        "password",
        "first_name",
        "last_name",
        "birthdate",
        "gender",
        "phone_number",
        "company",
        "company_location",
        "address_details"
    ];

    // Find any missing field in the request body
    const missingFields = fields.filter(
        field => !req.body[field]
    );

    if (missingFields.length > 0) {
        deleteUploadedFiles(req.files);

        return res.status(400).json({
            message: "Please make sure that all required fields are filled",
            missing_fields: missingFields
        })
    }

    // Now, check if all required documents are uploaded
    const files = [
        "company_id",
        "certificate",
        "authorization"
    ];

    // Find any missing required files
    const missingFiles = files.filter(
        file => !req.files?.[file]?.length
    );

    if (missingFiles.length > 0) {
        deleteUploadedFiles(req.files);
        
        return res.status(400).json({
            message: "Please upload all required files",
            missing_files: missingFiles
        })
    }

    // Next, validate the password
    const { password } = req.body;

    // Ensure password complexity
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[^\s]{8,}$/;

    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            message: "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character."
        });
    };

    if (password.includes(" ")) {
        return res.status(400).json({
            message: "Password cannot contain spaces."
        });
    };

    // If there are no missing fields, proceed with the registration process
    try {
        const reviewer = await Reviewer.findReviewerByEmail(req.body.email);

        // Return an error if the email is already used
        if (reviewer) {
            return res.status(409).json({
                message: "This email already exists."
            })
        }

        // Initialize the uploaded documents first before registering the reviewer
        const company_id_path = req.files.company_id?.[0]?.path;
        const certificate_path = req.files.certificate?.[0]?.path;
        const authorization_path = req.files.authorization?.[0]?.path;

        // Otherwise, let the reviewer be registered in the system
        await Reviewer.create({
            ...req.body,

            company_id: company_id_path,
            certificate: certificate_path,
            authorization: authorization_path
        });

        res.status(200).json({
            message: "Reviewer successfully sent for verification. Please wait until your account has been verified."
        });
    }
    catch (e) {
        // Return the error message if an unexpected error occurs
        res.status(500).json({
            message: e.message
        });
    }
};

// For reviewer login
export const loginReviewer = async (req, res) => {
    try {
        const { email_address, password } = req.body;

        // Check if the reviewer exists
        const reviewer = await Reviewer.findReviewerByEmail(email_address);
        if (!reviewer) { 
            return res.status(404).json({ error: "Reviewer does not exist" });
        };

        // Check if the required fields match
        const isMatch = await bcrypt.compareSync(password, reviewer.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email address or password" });
        };

        // If conditions above are satisfied, generate a token and allow the user to login
        // TODO: add JWT and OTP
        res.status(200).json({
            message: "Login successful"
        });
    }
    catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};