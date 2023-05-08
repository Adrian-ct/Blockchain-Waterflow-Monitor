// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { contact } from "../../types/fullstack";
import Contact from "../../model/Contact";
import User from "../../model/User";
import { log } from "console";

type ResponseData = {
  msg?: contact;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return res
      .status(200)
      .json({ error: "This API call only accepts POST methods" });
  }

  const { name, contactEmail, phoneNumber, avatar, userEmail } = req.body;
  log("req.body", req.body);

  if (!name || !contactEmail || !phoneNumber || !avatar || !userEmail) {
    return res.status(400).json({ error: "Please fill all the fields" });
  }

  let user = await User.findOne({ email: userEmail });
  if (!user) return res.status(400).json({ error: "User not found" });

  let contact = await Contact.findOne({ email: contactEmail });

  if (contact) return res.status(400).json({ error: "Contact already exists" });

  contact = new Contact({
    name,
    email: contactEmail,
    phoneNumber,
    avatar,
    userId: user._id,
  });

  try {
    contact = await contact.save();
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
  let contactToSend = {
    name: contact.name,
    email: contact.email,
    phoneNumber: contact.phoneNumber,
    avatar: contact.avatar,
  };
  res.status(200).json({ msg: contactToSend });
}
