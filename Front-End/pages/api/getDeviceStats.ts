// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { log } from "console";
import User from "../../model/User";
import { contract } from "../../exports/web3";
import getDb from "../../exports/orbitDB";
import { DatabaseEntry, DeviceData, EntryData } from "../../types/orbitDB";

type ResponseData = {
  result?: { [deviceID: string]: EntryData[] };
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
  devices.forEach(async (uid: string) => {
    const data = await contract.methods
      .getCIDsByDeviceID(uid)
      .call({ from: publicKey });
    log(data, `data for ${uid}`);
  });

  //The devices were fetched successfully, now we need to get the stats for each device
  let db = await getDb();
  let deviceStats: { [deviceID: string]: EntryData[] } = {};

  await Promise.all(
    devices.map(async (uid: string) => {
      const dataPoints = await db.get(uid);
      if (dataPoints) {
        deviceStats[uid] = dataPoints;
      } else {
        deviceStats[uid] = [];
      }
    })
  );

  res.status(200).json({ result: deviceStats });
}
