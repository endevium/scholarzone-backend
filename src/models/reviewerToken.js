import pool from "../config/database.js";

class ReviewerToken {
    static async createToken(reviewerId, token, expiresAt) {
        const [result] = await pool.query(
            `
            INSERT INTO reviewer_tokens(
                reviewer_id,
                token,
                expires_at
            ) VALUES (?, ?, ?)
            `,
            [
                reviewerId, 
                token, 
                expiresAt
            ]
        );

        return result.insertId;
    };

    static async findByToken(token) {
        const [rows] = await pool.query(
            `
                SELECT * FROM reviewer_tokens
                WHERE token = ?
            `,
            [token]
        );

        return rows[0] || null;
    };

    static async deleteToken(token) {
        const [result] = await pool.query(
            `
                DELETE FROM reviewer_tokens
                WHERE token = ?
            `,
            [token]
        );

        return result.affectedRows;
    };

    static async deleteTokensByReviewer(reviewerId) {
        const [result] = await pool.query(
            `
                DELETE FROM reviewer_tokens
                WHERE reviewer_id = ?
            `,
            [reviewerId]
        );

        return result.affectedRows;
    };
};

export default ReviewerToken;