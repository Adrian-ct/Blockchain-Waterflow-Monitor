import type { NextApiRequest, NextApiResponse } from "next";
import { log } from "console";
import { ResponseData } from "./register";
import User from "../../model/User";
import { contract, web3 } from "../../exports/web3";

const BUSINESS_EMAIL = "business@yahoo.com";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "GET") {
    return res
      .status(400)
      .json({ error: "This API call only accepts GET methods" });
  }
  const { deviceID, data } = req.query;
  const business = await User.findOne({ email: BUSINESS_EMAIL });
  if (!business) return res.status(400).json({ error: "Business not found" });
  try {
    const result = await contract.methods
      .getAddressByDeviceID(deviceID)
      .call({ from: business.publicKey });
    const [publicKey, isAddressValid] = [result["0"], result["1"]];

    if (!isAddressValid) {
      return res.status(400).json({ error: "Device not found" });
    }

    //save the data on IPFS, get the hash
    //find the user by public key
    //save the hash in the contract using the user's private key

    res.status(200).json({ msg: publicKey });
  } catch (err: any) {
    log(err);
    return res.status(400).json({ error: "Error while fetching devices" });
  }
}
