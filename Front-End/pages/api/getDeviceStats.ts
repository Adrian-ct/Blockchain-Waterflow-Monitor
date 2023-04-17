// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { log } from "console";
import User from "../../model/User";
import { contract } from "../../exports/web3";
import getDb from "../../exports/orbitDB";
import { DeviceStats, DeviceWaterflow, Stats } from "../../types/orbitDB";
import Device from "../../model/Device";

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
  let publicKey: string;
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: "Email is empty" });
  let devices;
  const user = await User.findOne({ email: email });
  if (!user) return res.status(400).json({ error: "User not found" });

  try {
    publicKey = user.publicKey;
    devices = await contract.methods
      .getDeviceIDsByUser(publicKey)
      .call({ from: publicKey });
  } catch (err: any) {
    log(err);
    return res.status(400).json({ error: "Error while fetching devices" });
  }

  log(devices, "devices");

  //The devices were fetched successfully, now we need to get the stats for each device
  let db = await getDb();
  let deviceStats: DeviceStats = {};

  await Promise.all(
    devices.map(async (uid: string) => {
      const device = await Device.findOne({ uid: uid });
      const latestDataPoints: Stats[] = await db
        .iterator({ limit: 20 })
        .collect()
        .filter((e: any) => e.payload.value.uid === uid)
        .map((e: any) => {
          const { waterflow, timestamp } = e.payload.value as DeviceWaterflow;
          return { waterflow, timestamp } as Stats;
        })
        .sort(
          (a: Stats, b: Stats) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

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
      log(deviceStats, "deviceStats");
    })
  );

  //For now
  //delete deviceStats[1];

  res.status(200).json({ result: deviceStats });
}
