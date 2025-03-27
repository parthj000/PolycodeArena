import nodemailer from "nodemailer";
import path from "path";

type MailOptions = {
  from: { name: string; address: string };
  to: string;
  subject: string;
  text: string;
  html: string;
  attachments?: { filename: string; path: string }[];
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.USER as string,
    pass: process.env.PASSWORD as string,
  },
});

const sendMailCert = async (
  email: string,
  username: string,
  message: string,
  attachmentPath?: string
): Promise<void> => {
  try {
    console.log(email, username, message);
    const mailOptions: MailOptions = {
      from: { name: "PolyCode Arena", address: process.env.USER as string },
      to: email,
      subject: "Congratulations! You have been invited.",
      text: `Dear ${username},\n\n${message}`,
      html: `<body><p>Dear ${username},</p><pre>${message}</pre></body>`,
    };

    if (attachmentPath) {
      mailOptions.attachments = [{ filename: path.basename(attachmentPath), path: attachmentPath }];
    }

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const sendMailBuyTicket = async (
  email: string,
  username: string,
  message: string,
  ownershipId: string,
  productUrl: string
): Promise<void> => {
  try {
    console.log(email, username, message, ownershipId, productUrl);
    const mailOptions: MailOptions = {
      from: { name: "PolyCode Arena", address: process.env.USER as string },
      to: email,
      subject: "🎟️ Ownership Certificate - Your Product Details 🎟️",
      text: `Dear ${username},\n\n${message}\n\nOwnership ID: ${ownershipId}\nProduct URL: ${productUrl}`,
      html: `<body><p>Dear ${username},</p><p>${message}</p><p>Ownership ID: ${ownershipId}</p><img src="${productUrl}" alt="Product" /></body>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const sendRecruitmentInvite = async (
  email: string,
  username: string,
  companyName: string,
  driveName: string,
  invitationCode: string
): Promise<boolean> => {
  try {
    const mailOptions: MailOptions = {
      from: { name: "PolyCode Arena", address: process.env.USER as string },
      to: email,
      subject: "🎯 You've Been Invited to a Recruitment Drive! 🎯",
      text: `Dear ${username},\n\nYou have been invited to participate in the recruitment drive \"${driveName}\" by ${companyName}.\n\nYour invitation code is: ${invitationCode}\n\nBest regards,\nPolyCode Arena Team`,
      html: `<body><p>Dear ${username},</p><p>You have been invited to the recruitment drive: ${driveName} by ${companyName}.</p><p>Invitation Code: ${invitationCode}</p></body>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Recruitment invitation email sent successfully:", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending recruitment invitation email:", error);
    return false;
  }
};

export { sendMailCert, sendMailBuyTicket, sendRecruitmentInvite };
