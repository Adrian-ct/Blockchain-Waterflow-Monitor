// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { log } from "console";
import { ResponseData } from "../../types/fullstack";
import Contact from "../../model/Contact";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "DELETE") {
    return res
      .status(200)
      .json({ error: "This API call only accepts DELETE methods" });
  }

  let { contactEmail } = req.query as { contactEmail: string };

  if (!contactEmail)
    return res.status(400).json({ error: "Contact Email is empty" });

  const contact = await Contact.findOne({ email: contactEmail });

  if (!contact) return res.status(400).json({ error: "Contact not found" });

  await contact.remove();
  res.status(200).json({ msg: "Contact removed successfully!" });
}
