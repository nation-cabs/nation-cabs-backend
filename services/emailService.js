import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT || 465),
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

transporter.verify()
    .then(() => {
        console.log("EMAIL SERVER READY");
    })
    .catch((error) => {
        console.error("EMAIL SERVER ERROR:", error);
    });

export const sendVerificationEmail = async (
    email,
    token
) => {

    const verificationLink =
        `${process.env.CLIENT_URL}/verify-email?token=${token}`;

    await transporter.sendMail({
        from: `"Nation Cabs" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Verify your Nation Cabs account",

        html: `
            <h2>Welcome to Nation Cabs</h2>

            <p>
                Thank you for creating your Nation Cabs account.
            </p>

            <p>
                Please click the button below to verify
                your email address.
            </p>

            <a
                href="${verificationLink}"
                style="
                    display:inline-block;
                    padding:12px 20px;
                    background:#000;
                    color:#fff;
                    text-decoration:none;
                    border-radius:5px;
                "
            >
                Verify Email
            </a>

            <p>
                If you did not create a Nation Cabs account,
                you can safely ignore this email.
            </p>
        `
    });
};