// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { log } from "console";
import { ResponseData } from "./register";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return res
      .status(400)
      .json({ error: "This API call only accepts POST methods" });
  }
  log(req.body);
  const { uid, waterflow, timestamp } = req.body;
  const roundedWaterflow = parseFloat(waterflow).toFixed(2);
  log(roundedWaterflow);

  res.status(200).json({ msg: "It's ok" });
}
