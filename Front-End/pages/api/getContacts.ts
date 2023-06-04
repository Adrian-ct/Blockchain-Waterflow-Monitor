// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { log } from "console";
import User from "../../model/User";
import Contact from "../../model/Contact";
import { contact } from "../../types/fullstack";
import { getSession } from "next-auth/react";

type ResponseData = {
  msg?: contact[];
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ error: "This API call only accepts GET methods" });
  }

  const session = await getSession({ req });
  if (!session) return res.status(400).json({ error: "User not logged in" });

  const email = session.user?.email;

  let contacts;

  const user = await User.findOne({ email: email });

  if (!user) return res.status(400).json({ error: "User not found" });
  try {
    contacts = await Contact.find({ userId: user._id });
  } catch (err: any) {
    log(err);
    return res.status(400).json({ error: "Error while fetching contacts" });
  }

  let contactsToSend: contact[] = contacts.map((contact) => {
    return {
      name: contact.name,
      email: contact.email,
      phoneNumber: contact.phoneNumber,
      avatar: contact.avatar,
    };
  });

  res.status(200).json({ msg: contactsToSend });
}
