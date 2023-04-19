// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { log } from "console";
import User from "../../model/User";
import getDb from "../../exports/orbitDB";
import { DeviceStats, DeviceWaterflow, Stats } from "../../types/orbitDB";
import Device from "../../model/Device";
import { getDevices } from "../../utils/contractHelpers";

type ResponseData = {
  result?: DeviceStats;
  error?: string;
};

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
  const { limit } = req.query;

  if (!email) return res.status(400).json({ error: "Email is empty" });
  let devices;
  const user = await User.findOne({ email: email });
  if (!user) return res.status(400).json({ error: "User not found" });

  devices = await getDevices(user.publicKey);
  if (!devices)
    return res.status(400).json({ error: "Error while fetching devices" });

  //The devices were fetched successfully, now we need to get the stats for each device
  let db = await getDb();
  let deviceStats: DeviceStats = {};

  await Promise.all(
    devices.map(async (uid: string) => {
      const device = await Device.findOne({ uid: uid });
      const latestDataPoints: Stats[] = await db
        .iterator({ limit: -1 })
        .collect()
        .filter((e: any) => {
          const isValid = e.payload.value.uid === uid;
          return isValid;
        })
        .map((e: any) => {
          const { waterflow, timestamp } = e.payload.value as DeviceWaterflow;
          return { waterflow, timestamp } as Stats;
        })
        .sort(
          (a: Stats, b: Stats) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
        .slice(0, limit);

      if (latestDataPoints) {
        deviceStats[uid] = {
          alias: device?.alias,
          stats: latestDataPoints,
        };
      } else {
        deviceStats[uid] = {
          alias: device?.alias,
          stats: [],
        };
      }
    })
  );

  res.status(200).json({ result: deviceStats });
}
