// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { log } from "console";
import getDb from "../../exports/orbitDB";
import User from "../../model/User";
import { contract } from "../../exports/web3";

type ResponseData = {
  result?: string[];
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "GET") {
    return res
      .status(200)
      .json({ error: "This API call only accepts POST methods" });
  }
  const { email } = req.query;

  let publicKey: string;
  let devices: string[] = [];

  if (!email) return res.status(200).json({ error: "Email is empty" });

  const user = await User.findOne({ email: email });

  if (!user) return res.status(200).json({ error: "User not found" });

  try {
    publicKey = user.publicKey;
    devices = await contract.methods
      .getDeviceIDsByUser(publicKey)
      .call({ from: publicKey });
  } catch (err: any) {
    log(err);
    return res.status(400).json({ error: "Error while fetching devices" });
  }

  res.status(200).json({ result: devices });
}
