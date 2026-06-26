import fs from "fs";

export const deleteUploadedFiles = (files) => {
    Object.values(files || {}).forEach(fileArray => {
        fileArray.forEach(file => {
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
        });
    });
};