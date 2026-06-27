import bcrypt from "bcrypt";
import OTP from "../models/otp.js";

export const sendOTP = async (email_address, user_type, purpose) => {
    // Delete the existing OTPs associated with the email and purpose
    await OTP.deleteExistingOTP(email_address, user_type, purpose);

    // Then generate a 6-digit OTP and hash it after
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    //const hashedOTP = await bcrypt.hash(otp, 10);

    // Set the expiration to 5 minutes
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Create the OTP object
    await OTP.createOTP(
        email_address,
        user_type,
        purpose,
        expiresAt
    );

    return otp;
}

export const verifyOTP = async (email_address, user_type, purpose, otp) => {
    const record = await OTP.getOTP(
        email_address,
        user_type,
        purpose
    );

    // Check if the OTP actually exists
    if (!record) {
        throw new Error("OTP record not found")
    };

    // Check if the OTP has expired
    if (new Date() > new Date(otpRecord.expires_at)) {
        throw new Error("Sorry, this OTP has expired")
    };

    // Compare OTP
    //const isMatch = await bcrypt.compareSync(otp, record.code);

    //if (!isMatch) {
        //throw new Error("Sorry, this OTP is invalid");
    //};

    // Mark OTP as used
    await OTP.markAsUsed(record.id);

    return true;
};