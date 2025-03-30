/* eslint-disable @typescript-eslint/no-unused-vars */
import { sendEmail } from "../Utils/sendEmailFunc";
import { INewsLetter } from "./newsletter.interface";
import NewsLetter from "./newsletter.model";



const addNewsLetter = async (newsLetter: INewsLetter) => {
    return await NewsLetter.create(newsLetter);
};

const getNewsLetter = async () => {
    return await NewsLetter.find()
};
const getNewsLetterByEmail = async (email: string) => {
    return await NewsLetter.find({ email: email })
};
const deleteNewsLetter = async (email: string) => {
    return await NewsLetter.findOneAndDelete({ email });
};

const sendNewsletterToAll = async (subject: string, body: string) => {
    try {
        const subscribers = await NewsLetter.find({}, 'email');

        if (!subscribers.length) {
            throw new Error("No subscribers found.");
        }

        const emailPromises = subscribers.map(subscriber => {
            const emailBody = `
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f9f9f9;
                        color: #333;
                        margin: 0;
                        padding: 0;
                    }
                    .email-container {
                        width: 100%;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #fff;
                        border: 1px solid #ddd;
                        border-radius: 8px;
                    }
                    .header {
                        background-color: #FB8600;
                        color: #fff;
                        padding: 10px;
                        text-align: center;
                        border-radius: 8px 8px 0 0;
                    }
                    .content {
                        padding: 20px;
                        font-size: 16px;
                    }
                    .footer {
                        text-align: center;
                        font-size: 14px;
                        color: #666;
                        margin-top: 20px;
                    }
                    .footer a {
                        color: #2a9d8f;
                        text-decoration: none;
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="header">
                        <h2>RE-LIST - Second Hand Marketplace</h2>
                        <p>${subject}</p>
                    </div>
                    <div class="content">
                        <p>Hi there,</p>
                        <p>${body}</p>
                        <p>Please visit <a href="https://relistshop.vercel.app/">our platform</a> to check out more details and respond accordingly.</p>
                        <p>Thank you for being a part of RE-LIST!</p>
                    </div>
                    <div class="footer">
                        <p>If you have any questions, feel free to contact us at <a href="mailto:joychandraud@gmail.com">joychandraud@gmail.com</a></p>
                    </div>
                </div>
            </body>
            </html>
            `;

            // Call sendEmail function to send the email to each subscriber
            return sendEmail(subscriber.email, subject, emailBody);
        });

        await Promise.all(emailPromises); // Send emails in parallel

        return { success: true, message: 'Newsletter sent successfully to all users' };
    } catch (error) {
        throw new Error('Failed to send newsletter ');
    }
};



export const NewsLetterService = {
    addNewsLetter,
    getNewsLetter,
    getNewsLetterByEmail,
    deleteNewsLetter,
    sendNewsletterToAll
};
