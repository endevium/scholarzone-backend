import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === "company_id") {
            cb(null, "src/uploads/company_ids")
        }
        else if (file.fieldname === "certificate") {
            cb(null, "src/uploads/certificates_of_employment")
        }
        else if (file.fieldname === "authorization") {
            cb(null, "src/uploads/authorization_letters")
        }
    },

    filename: (req, file, cb) => {
        const newName = Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
        cb(null, newName);
    }
});

const upload = multer({storage});

export default upload;