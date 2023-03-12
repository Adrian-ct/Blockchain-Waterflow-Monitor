import { log } from "console";
import { NextApiRequest, NextApiResponse } from "next";
import getDb from "../../exports/orbitDB";
import { ResponseData } from "./register";

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

  let cid;
  //let db = await getDb();
  //   db.add("world")
  //     .then(() => {
  //       //   cid = db.iterator({ limit: -1 }).collect().slice(-1)[0].hash;
  //       //   console.log(cid);
  //       console.log("Worked");
  //     })
  //     .catch((err: any) => {
  //       console.error(err);
  //     });

  if (cid) {
    res.status(200).json({ msg: "Successfuly" });
  } else {
    res.status(400).json({ error: "Error " });
  }
}
