import type { NextApiRequest, NextApiResponse } from "next";
import { log } from "console";
import { ResponseData } from "./register";
import getDb from "../../exports/orbitDB";
import Device from "../../model/Device";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "PUT") {
    return res
      .status(200)
      .json({ error: "This API call only accepts PUT methods" });
  }
  const { uid, alias, active } = req.body;
  log(uid, alias, active, "uid, alias, active");

  const device = await Device.findOne({ uid: uid });
  if (!device) return res.status(400).json({ error: "Device not found" });
  device.alias = alias;
  device.active = active;

  try {
    await device.save();
  } catch (err) {
    return res.status(400).json({ error: "Error while updating device" });
  }

  res.status(200).json({ msg: "Device Updated!" });
}
