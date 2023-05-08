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
  result?: RecurrentStats[];
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

  let devices: string[] = [];

  if (!email) return res.status(200).json({ error: "Email is empty" });

  const user = await User.findOne({ email: email });

  if (!user) return res.status(200).json({ error: "User not found" });

  devices = await getDevices(user.publicKey);

  if (!devices)
    return res.status(200).json({ error: "Error while fetching devices" });
  let db = await getDb();

  let monthlyStats: RecurrentStats[] = [];

  //For every device we need to sum the waterflow for an entire day
  await Promise.all(
    devices.map(async (uid: string) => {
      const device = await Device.findOne({ uid: uid });
      const latestDataPoints: Stats[] = await db
        .iterator({ limit: -1 })
        .collect()
        .filter((e: any) => e.payload.value.uid === uid)
        .filter((e: any) => {
          const eventDate = new Date(e.payload.value.timestamp);
          //log(eventDate, "eventDate");
          const currentDate = new Date();
          return (
            eventDate.getFullYear() === currentDate.getFullYear() &&
            eventDate.getMonth() === currentDate.getMonth() &&
            eventDate.getDate() === currentDate.getDate() &&
            eventDate.getHours() === currentDate.getHours()
          );
        })
        .map((e: any) => {
          const { waterflow, timestamp } = e.payload.value as DeviceWaterflow;
          return { waterflow, timestamp } as Stats;
        });

      let totalWaterflow = latestDataPoints.reduce(
        (accumulator: number, currentValue: Stats) => {
          return accumulator + parseFloat(currentValue.waterflow);
        },
        0
      );

      totalWaterflow = parseFloat(totalWaterflow.toFixed(2));

      monthlyStats.push({
        [device?.alias as string]: totalWaterflow,
      });
    })
  );

  //log(monthlyStats, "monthlyStats");
  res.status(200).json({ result: monthlyStats });
}
