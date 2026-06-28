import { transporter } from "../services/nodemailer.js";

/**
 * @param {string} to
 * @param {string} name
 * @param {string} otp
 */
export const emailSender = async (to, name, otp) => {
    const title = "ScholarZone Verification Code";
    const subject = "ScholarZone Verification Code"
    const message = "Please use the verification code below";

    const html = `
        <div style="font-family: Arial, sans-serif; background-color: #f8f9fa; padding: 20px;">
            <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); padding: 30px;">
                <h2 style="text-align: center; color: #2f62c0;">${title}</h2>
                <p style="font-size: 16px; color: #333;">
                Hello ${name || ""},
                </p>
                <p style="font-size: 15px; color: #333;">
                ${message}
                </p>

                <div style="text-align: center; margin: 25px 0;">
                <span style="display: inline-block; background-color: #003494; color: white; font-size: 24px; font-weight: bold; padding: 12px 24px; border-radius: 6px; letter-spacing: 3px;">
                    ${otp}
                </span>
                </div>

                <p style="font-size: 15px; color: #333;">
                This code will expire in <strong>5 minutes</strong>.
                </p>

                <p style="color: #d9534f; font-weight: bold; font-size: 14px;">
                ⚠️ Do NOT share this code with anyone. We will never ask for it.
                </p>

                <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">
            </div>
        </div>
    `;

    await transporter.sendMail({
        from: `ScholarZone <${process.env.SMTP_USER}>`,
        to,
        subject,
        html
    })
}