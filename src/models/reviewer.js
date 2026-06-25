import pool from "../config/database";
import bcrypt from "bcrypt";

class Reviewer {
    static async findAllReviewers() {
        const [rows] = await pool.query(
            "SELECT * FROM reviewers"
        );

        return rows;
    }

    static async findReviewerByEmail(email) {
        const [rows] = await pool.query(
            "SELECT * FROM reviewers WHERE email = ?", [email]
        );

        return rows[0];
    }

    static async findReviewerById(id) {
        const [rows] = await pool.query(
            "SELECT * FROM reviewers WHERE id = ?", [id]
        );

        return rows[0];
    }

    static async create(data) {
        const hashed = await bcrypt.hash(
            data.password,
            10
        );

        const [result] = await pool.query(
            `INSERT INTO reviewers (
                email, password, first_name, last_name, birthdate, gender,
                phone_number, company, company_location, address_details,
                company_id, certificate, authorization
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.email,
                hashed,
                data.first_name,
                data.last_name,
                data.birthdate,
                data.gender,
                data.phone_number,
                data.company,
                data.company_location,
                data.address_details,
                data.company_id,
                data.certificate,
                data.authorization
            ]
        );

        return result;
    };

};