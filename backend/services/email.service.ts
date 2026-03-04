import sendEmailViaSMTP, { type EmailOptions } from "../config/email.ts";

async function sendEmail(options: EmailOptions) {
    //We'll just silently move along if SMTP isn't enabled.
    //I have to include a toggle because I can't send out a bunch of emails that don't exist
    //The service will get suspended
    if (process.env.ENABLE_SMTP === "true") {
        await sendEmailViaSMTP(options);
    } else {
        console.log("SMTP not enabled, skipping email send.");
    }

    //There's nothing to really return either. Optionally the messageID can be bubbled up, but not really relevant to users.
}

export default { sendEmail };
