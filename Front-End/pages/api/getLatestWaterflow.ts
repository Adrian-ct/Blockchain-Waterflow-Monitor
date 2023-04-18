// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { log } from "console";
import getDb from "../../exports/orbitDB";
import User from "../../model/User";
import { getDevices } from "../../utils/contractHelpers";
import Device from "../../model/Device";
import { DeviceWaterflow, Stats } from "../../types/orbitDB";
import { RecurrentStats } from "./getMonthlyStats";

type ResponseData = {
  result?: Stats;
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
  const { CID } = req.query;
  if (!CID) return res.status(200).json({ error: "CID is empty" });

  let db = await getDb();

  let latestDataPoint = await db.get(CID);
  res.status(200).json({
    result: {
      timestamp: latestDataPoint.payload.value.timestamp,
      waterflow: latestDataPoint.payload.value.waterflow,
    },
  });
}
