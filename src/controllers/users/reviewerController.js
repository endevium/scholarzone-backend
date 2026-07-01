import Reviewer from "../../models/users/reviewer.js";
import ReviewerToken from "../../models/tokens/reviewerToken.js";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";
import { emailSender } from "../../utils/emailSenderUtil.js";
import { sendOTP, verifyOTP } from "../../services/otp.js";
import { deleteUploadedFiles } from "../../utils/fileUtils.js";


// For reviewer (web) registration
export const registerReviewer = async (req, res) => {
    // Check for any missing required fields
    const fields = [
        "email",
        "password"
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
    //const files = [
        //"company_id",
        //"certificate",
        //"authorization"
    //];

    // Find any missing required files
    //const missingFiles = files.filter(
        //file => !req.files?.[file]?.length
    //);

    //if (missingFiles.length > 0) {
        //deleteUploadedFiles(req.files);
        
        //return res.status(400).json({
            //message: "Please upload all required files",
            //missing_files: missingFiles
        //})
    //}

    // Next, validate the password
    const { password } = req.body;

    // Ensure password complexity
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[^\s]{8,}$/;

    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            message: "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character"
        });
    };

    if (password.includes(" ")) {
        return res.status(400).json({
            message: "Password cannot contain spaces"
        });
    };

    // If there are no missing fields, proceed with the registration process
    try {
        const reviewer = await Reviewer.findReviewerByEmail(req.body.email);

        // Return an error if the email is already used
        if (reviewer) {
            return res.status(409).json({
                message: "This email already exists"
            })
        }

        // Initialize the uploaded documents first before registering the reviewer
        //const company_id_path = req.files.company_id?.[0]?.path;
        //const certificate_path = req.files.certificate?.[0]?.path;
        //const authorization_path = req.files.authorization?.[0]?.path;

        // Otherwise, let the reviewer be registered in the system
        await Reviewer.create({
            ...req.body,

            //company_id: company_id_path,
            //certificate: certificate_path,
            //authorization: authorization_path
        });

        return res.status(200).json({
            message: "Reviewer successfully sent for verification. Please wait until your account has been verified"
        });
    }
    catch (e) {
        // Return the error message if an unexpected error occurs
        return res.status(500).json({
            message: e.message
        });
    }
};

export const completeProfile = async (req, res) => {
    const fields = [
        "first_name",
        "last_name",
        "birthdate",
        "gender",
        "phone_number",
        "company",
        "company_location",
        "address_details",
    ];

    // Check if any fields are missing
    const missingFields = fields.filter(
        field => !req.body[field]
    );

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
            message: "Please make sure to fill all required files and upload all required files",
            missing_fields: missingFields,
            missing_files: missingFiles
        })
    };

    try {
        // Initialize the uploaded documents first
        const company_id_path = req.files.company_id?.[0]?.path;
        const certificate_path = req.files.certificate?.[0]?.path;
        const authorization_path = req.files.authorization?.[0]?.path;

        await Reviewer.completeProfile({
            ...req.body,
            company_id: company_id_path,
            certificate: certificate_path,
            authorization: authorization_path,
            id: req.params.id
        });

        return res.status(200).json({
            message: "Profile updated successfully"
        });
    }
    catch (e) {
        return res.status(500).json({
            error: e.message
        });
    }
};

// For reviewer login
export const loginReviewer = async (req, res) => {
    const fields = ["email_address", "password"];

    // Check if the required fields are missing
    const missingFields = fields.filter(
        field => !req.body[field]
    );

    if (missingFields.length > 0) {
        return res.status(400).json({
            message: "Please make sure that all required fields are filled",
            missing_fields: missingFields
        })
    };

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
        
        // Check if the reviewer is already approved or still pending
        const status = await Reviewer.checkReviewerStatus(email_address);
        if (status === "pending") {
            return res.status(400).json({ message: "Unverified account"})
        };

        if (status === "rejected") {
            return res.status(400).json({ message: "Rejected account"})
        };

        // If the account is verified, proceed with sending OTP
        const otp = await sendOTP(
            reviewer.email,
            "reviewer",
            "login"
        );

        await emailSender(reviewer.email, reviewer.first_name, otp);

        return res.status(200).json({
            message: "OTP has been sent to your email."
        });
    }
    catch (e) {
        return res.status(500).json({
            message: e.message
        });
    };
};

export const verifyReviewerOTP = async (req, res) => {
    const { email_address, otp } = req.body;

    const fields = [
        "email_address",
        "otp"
    ];

    // Check if either email and/or OTP is missing
    const missingFields = fields.filter(
        field => !req.body[field]
    );

    if (missingFields.length > 0) {
        return res.status(400).json({
            message: "Please make sure all required fields are filled",
            missing_fields: missingFields
        });
    };

    try {
        // Check if the reviewer actually exists
        const reviewer = await Reviewer.findReviewerByEmail(email_address);
        if (!reviewer) {
            return res.status(404).json({
                error: "This reviewer does not exist"
            });
        };

        await verifyOTP(
            email_address,
            "reviewer",
            "login",
            otp
        );

        // If conditions above are satisfied, generate a token and allow the user to login
        const token = jsonwebtoken.sign(
            {
                id: reviewer.id,
                email_address: reviewer.email_address,
                role: "reviewer"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        const decoded = jsonwebtoken.decode(token);
        const expiresAt = new Date(decoded.exp * 1000);

        await ReviewerToken.deleteTokensByReviewer(reviewer.id);
        
        // Add tokens to database
        await ReviewerToken.createToken(
            reviewer.id,
            token,
            expiresAt
        );

        return res.status(200).json({
            message: "Login successful!",
            token: token
        });
    }
    catch (e) {
        return res.status(500).json({
            error: e.message
        });
    };
}