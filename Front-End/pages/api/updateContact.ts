import type { NextApiRequest, NextApiResponse } from "next";
import { contact } from "../../types/fullstack";
import Contact from "../../model/Contact";
import User from "../../model/User";
import { log } from "console";
import { getSession } from "next-auth/react";

type ResponseData = {
  msg?: contact;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "PUT") {
    return res
      .status(405)
      .json({ error: "This API call only accepts PUT methods" });
  }

  const session = await getSession({ req });
  if (!session) return res.status(400).json({ error: "User not logged in" });

  const { originalEmail } = req.query;
  if (!originalEmail)
    return res.status(400).json({ error: "Original Email is empty" });

  const { name, contactEmail, phoneNumber, avatar, userEmail } = req.body;
  log("req.body", req.body);

  if (!name || !contactEmail || !phoneNumber || !avatar || !userEmail) {
    return res.status(400).json({ error: "Please fill all the fields" });
  }

  let user = await User.findOne({ email: userEmail });
  if (!user) return res.status(400).json({ error: "User not found" });

  let contact: contact;
  try {
    contact = (await Contact.findOneAndUpdate(
      { email: originalEmail },
      {
        email: contactEmail,
        name: name,
        phoneNumber: phoneNumber,
        avatar: avatar,
      },
      {
        new: true,
      }
    )) as contact;
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }

  if (!contact) return res.status(400).json({ error: "Contact not found" });

  let contactToSend = {
    name: contact.name,
    email: contact.email,
    phoneNumber: contact.phoneNumber,
    avatar: contact.avatar,
  };
  res.status(200).json({ msg: contactToSend });
}
