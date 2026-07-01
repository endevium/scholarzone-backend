import pool from "../../config/database.js";
import bcrypt from "bcrypt";

class Applicant {
    static async findAllApplicants() {
        const [rows] = await pool.query(
            "SELECT * FROM reviewers"
        );

        return rows;
    };

    static async findApplicantByEmail(email) {
        const [rows] = await pool.query(
            `
                SELECT * FROM reviewers
                WHERE email = ?
            `,
            [email]
        );

        return rows[0];
    };

    static async findApplicantById(id) {
        const [rows] = await pool.query(
            `
                SELECT * FROM reviewers
                WHERE id = ?
            `,
            [id]
        );

        return rows[0];
    };

    static async create(data) {
        const hashed = await bcrypt.hash(
            data.password, 10
        );

        const [result] = await pool.query(
            `
                INSERT INTO applicants(
                    email,
                    password
                ) VALUES (?, ?)
            `,
            [
                data.email,
                hashed
            ]
        );

        return result;
    };

    static async completeProfile(data) {
        const [result] = await pool.query(
            `
                UPDATE applicants
                SET first_name = ?,
                last_name = ?,
                birthdate = ?,
                gender = ?,
                phone_number = ?,
                school = ?,
                program = ?,
                address_line_1 = ?,
                address_line_2 = ?,
                WHERE id = ?
            `,
            [
                data.first_name,
                data.last_name,
                data.birthdate,
                data.gender,
                data.phone_number,
                data.school,
                data.program,
                data.address_line_1,
                data.address_line_2,
                data.id
            ]
        );

        return result;
    };
}

export default Applicant;