import type { NextApiRequest, NextApiResponse } from "next";
import { log } from "console";
import { ResponseData } from "../../types/fullstack";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ error: "This API call only accepts POST methods" });
  }
  const { subject, message, contactEmail, userEmail } = req.body;
  if (!subject || !message || !contactEmail || !userEmail)
    return res.status(400).json({ error: "Please fill all the fields" });

  let nodemailer = require("nodemailer");
  let email = process.env.EMAIL_ADDRESS;
  let password = process.env.EMAIL_PASSWORD;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: email,
      pass: password,
    },
  });

  const mailOptions = {
    from: email,
    to: "adybaloaica@gmail.com",
    subject: subject,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ msg: "Email sent!" });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}
