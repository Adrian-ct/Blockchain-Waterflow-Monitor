import { NextApiRequest, NextApiResponse } from "next";
import User from "../../model/User";
import { ResponseData, validateEmail } from "./register";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "GET") {
    return res
      .status(200)
      .json({ error: "This API call only accepts GET methods" });
  }

  const { email } = req.query;

  if (!validateEmail(email as string)) {
    return res.status(400).json("Email is invalid" as ResponseData);
  }

  const emailUser = await User.findOne({ email: email });

  if (emailUser) {
    return res.status(200).json(emailUser.privateKey as ResponseData);
  } else {
    return res.status(400).json("Email does not exist" as ResponseData);
  }
}
