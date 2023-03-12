// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { log } from "console";
import { ResponseData } from "./register";
import getDb from "../../exports/orbitDB";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return res
      .status(200)
      .json({ error: "This API call only accepts POST methods" });
  }
  const { publicKey, deviceID, data } = req.body;

  let db = await getDb();
  const hash = await db.add({
    publicKey,
    deviceID,
    data,
  });
  res.status(200).json({ msg: hash });
}
