
import nodemailer from 'nodemailer';

// Setup the nodemailer transporter (you can use your email service here)
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    service: 'gmail',
    auth: {
        user: 'joychandraud@gmail.com',
        pass: 'mkhc ubfy nhwu ituu',
    }
});
// Function to send an email
export const sendEmail = async (to: string, subject: string, html: string) => {
    const mailOptions = {
        from: process.env.EMAIL_USER, // Sender address
        to, // Receiver's email address
        subject, // Subject line
        html, // HTML message body
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};