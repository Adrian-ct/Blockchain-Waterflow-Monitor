// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { log } from "console";
import { ResponseData } from "./register";
import User from "../../model/User";
import { contract } from "../../exports/web3";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "GET") {
    return res
      .status(400)
      .json({ error: "This API call only accepts GET methods" });
  }
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: "Email is empty" });
  let devices;
  const user = await User.findOne({ email: email });
  if (!user) return res.status(400).json({ error: "User not found" });
  try {
    const publicKey = user.publicKey;
    devices = await contract.methods
      .getDeviceIDsByUser(publicKey)
      .call({ from: publicKey });
  } catch (err: any) {
    log(err);
    return res.status(400).json({ error: "Error while fetching devices" });
  }

  res.status(200).json({ msg: devices });
}
