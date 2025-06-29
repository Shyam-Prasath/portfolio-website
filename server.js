const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));
const PORT = 3000;

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGOURI);
        console.log("Connected to database");
    } catch (err) {
        console.log("Error connecting to database: ", err);
    }
};
connect();

const Form = require("./formschema");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

app.post("/send-email", async (req, res) => {
    const { name, email, subject, message } = req.body;

    try {
        const newForm = new Form({ name, email, subject, message });
        await newForm.save();

        const mailOptions = {
        from: `"${name}" <${email}>`,
        to: process.env.EMAIL_USER,
        subject: subject,
        html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 0;">
            <table role="presentation" cellspacing="0" cellpadding="0" width="100%" style="margin: 0; padding: 0; border-spacing: 0;">
            <tr>
                <td align="center" style="padding: 0;">
                <table role="presentation" cellspacing="0" cellpadding="0" width="100%" style="max-width: 600px; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 18px rgba(0,0,0,0.12);">
                    
                    <!-- Header -->
                    <tr>
                    <td style="background: #000; color: #fff; text-align: center; padding: 30px 40px 20px;">
                        <img src="https://i.postimg.cc/hJWJFZV6/sriram-logo.png" alt="SRM Topper Logo" height="100" style="margin-bottom: 12px; border-radius:2rem;" />
                        <h2 style="margin: 0; font-weight: 500; font-size: 22px;">New Portfolio Inquiry</h2>
                        <p style="font-size: 14px; opacity: 0.7; margin: 6px 0 0;">You’ve received a message via your website</p>
                    </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                    <td style="padding: 30px 40px;">
                        <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 15px; color: #333;">
                        <tr>
                            <td style="padding: 8px 0; width: 80px;"><strong>Name:</strong></td>
                            <td>${name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0;"><strong>Email:</strong></td>
                            <td>${email}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0;"><strong>Subject:</strong></td>
                            <td>${subject}</td>
                        </tr>
                        </table>

                        <div style="margin-top: 24px;">
                        <p style="margin-bottom: 8px; font-weight: bold;">Message:</p>
                        <div style="background: #f8f9fa; border-left: 4px solid #000; padding: 16px 20px; border-radius: 6px; font-size: 14px; color: #555; line-height: 1.6;">
                            ${message}
                        </div>
                        </div>
                    </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                    <td style="padding: 20px 40px; text-align: center; background-color: #f4f4f5; font-size: 12px; color: #999;">
                        © ${new Date().getFullYear()} SRM Topper. All rights reserved.
                    </td>
                    </tr>

                </table>
                </td>
            </tr>
            </table>
        </div>
        `,
        };

        await transporter.sendMail(mailOptions);

        res.json({ success: true });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false });
    }
});
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
