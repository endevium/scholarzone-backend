import pool from "../config/database.js";
import bcrypt from "bcrypt";

class Reviewer {
    static async findAllReviewers() {
        const [rows] = await pool.query(
            "SELECT * FROM reviewers"
        );

        return rows;
    };

    static async findReviewerByEmail(email) {
        const [rows] = await pool.query(
            "SELECT * FROM reviewers WHERE email = ?", [email]
        );

        return rows[0];
    };

    static async findReviewerById(id) {
        const [rows] = await pool.query(
            "SELECT * FROM reviewers WHERE id = ?", [id]
        );

        return rows[0];
    };

    static async checkReviewerStatus(email) {
        const [rows] = await pool.query(
            "SELECT status FROM reviewers WHERE email = ?", [email]
        );

        return rows.length > 0 ? rows[0].status : null;
    };

    static async create(data) {
        const hashed = await bcrypt.hash(
            data.password,
            10
        );

        const [result] = await pool.query(
            `INSERT INTO reviewers (
                email, password
            ) VALUES (?, ?)`,
            [
                data.email,
                hashed,
            ]
        );

        return result;
    };

};

export default Reviewer;