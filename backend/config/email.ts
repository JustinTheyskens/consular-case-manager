import nodemailer, { type Transporter } from "nodemailer";

export interface EmailOptions {
    from?: string; //Optional in case the SMTP user is different than the 'from'
    to: string;
    subject: string;
    text?: string;
    html?: string;
}

const createTransporter = (): Transporter => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_TLS === "true",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
};

export default async function sendEmailViaSMTP(options: EmailOptions) {
    const transporter = createTransporter();

    const mailOptions = {
        from: options.from || process.env.SMTP_USER,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: %s", info.messageId);
}
