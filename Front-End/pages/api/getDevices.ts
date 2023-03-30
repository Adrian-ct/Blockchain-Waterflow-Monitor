// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { log } from "console";
import { ResponseData } from "./register";
import getDb from "../../exports/orbitDB";

type EntryData = {
  publicKey: string;
  deviceID: string;
  data: string;
};

export interface DatabaseEntry {
  hash: string;
  id: string;
  payload: {
    op: string;
    key: string;
    value: EntryData;
  };
  identity: {
    id: string;
    publicKey: string;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "GET") {
    return res
      .status(200)
      .json({ error: "This API call only accepts POST methods" });
  }
  const { publicKey } = req.query;

  let db = await getDb();
  const entries = db
    .iterator({ limit: -1 })
    .collect()
    .map((e: DatabaseEntry) => e.payload.value)
    .filter((e: EntryData) => e.publicKey === publicKey);

  res.status(200).json({ msg: entries });
}
