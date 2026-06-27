import pool from "../config/database.js";

class OTP {
    static async createOTP(emailAddress, userType, code, purpose, expiresAt) {
        const [result] = await pool.query(
            `
                INSERT INTO otp(
                    email_address, 
                    user_type, 
                    code, 
                    purpose, 
                    expires_at
                ) VALUES (?, ?, ?, ?, ?)
            `,
            [
                emailAddress,
                userType,
                code,
                purpose,
                expiresAt
            ]
        );

        return result;
    };

    static async getOTP(email_address, user_type, purpose) {
        const [rows] = await pool.query(
            `
                SELECT * FROM otp
                WHERE email_address = ?
                AND user_type = ?
                AND purpose = ?
                AND used = FALSE
                LIMIT 1
            `,
            [
                email_address,
                user_type,
                purpose
            ]
        );

        return rows[0];
    };

    static async markAsUsed(id) {
        const [result] = await pool.query(
            `
                UPDATE otp
                SET used = TRUE
                WHERE id = ?
            `,
            [id]
        );

        return result;
    };

    static async deleteExistingOTP(emailAddress, userType, purpose) {
        const [result] = await pool.query(
            `
                DELETE FROM otp
                WHERE email_address = ?
                AND user_type = ?
                AND purpose = ?
            `,
            [
                emailAddress,
                userType,
                purpose
            ]
        );

        return result;
    };

    static async deleteExpiredOTP() {
        const [result] = await pool.query(
            `
                DELETE FROM otp
                WHERE expired_at < NOW()
            `
        );

        return result;
    };
};

export default OTP;