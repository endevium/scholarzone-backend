import Reviewer from "../models/reviewer.js";

export const registerReviewer = async (req, res) => {
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
