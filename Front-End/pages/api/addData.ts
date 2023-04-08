import type { NextApiRequest, NextApiResponse } from "next";
import { log } from "console";
import { ResponseData } from "./register";
import User from "../../model/User";
import { contract, web3 } from "../../exports/web3";
import getDb from "../../exports/orbitDB";

const BUSINESS_EMAIL = "business@yahoo.com";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return res
      .status(400)
      .json({ error: "This API call only accepts POST methods" });
  }
  const data = req.body.data;
  const deviceID = req.body.deviceID.trim();

  if (!data || !deviceID) {
    return res.status(400).json({ error: "Invalid data" });
  }

  const business = await User.findOne({ email: BUSINESS_EMAIL });
  if (!business) return res.status(400).json({ error: "Business not found" });

  try {
    const result = await contract.methods
      .getAddressByDeviceID(deviceID)
      .call({ from: business.publicKey });

    const [publicKey, isAddressValid] = [result["0"], result["1"]];

    log("publicKey: " + publicKey);
    log("isAddressValid: " + isAddressValid);
    if (!isAddressValid) {
      return res.status(400).json({ error: "Device not found" });
    }

    //save the data on IPFS, get the hash
    let db = await getDb();
    let hash;
    const existingDataPoints = await db.get(deviceID);
    if (existingDataPoints) {
      log("existingDataPoints: " + JSON.stringify(existingDataPoints, null, 2));
       // Update the existing entry with the new data point
      const newDataPoints = [...existingDataPoints, data];
      hash = await db.put(deviceID, newDataPoints);
    } else {
      // Save a new entry with the device ID and the data point
      hash = await db.put(deviceID, [data]);
    }
    //find the user by public key
    const user = await User.findOne({ publicKey });
    const account = web3.eth.accounts.decrypt(
      user.privateKey,
      process.env.WEB3_SECRET as string
    );
    //save the hash in the contract using the user's private key
    const txObject = contract.methods.addWaterFlowData(deviceID, hash);

    const gasPrice = await web3.eth.getGasPrice();
    const gasLimit = await txObject.estimateGas({ from: account.address });

    const transaction = {
      to: contract.options.address,
      data: txObject.encodeABI(),
      gasPrice,
      gasLimit,
      from: account.address,
    };
    try {
      const signedTransaction = await web3.eth.accounts.signTransaction(
        transaction,
        account.privateKey
      );
      await web3.eth.sendSignedTransaction(
        signedTransaction.rawTransaction as string
      );
    } catch (err: any) {
      log(err);
      return res
        .status(400)
        .json({ error: "Error creating transaction:" + err.message });
    }

    res.status(200).json({ msg: "Data saved succesfully" });
  } catch (err: any) {
    log(err);
    return res.status(400).json({ error: "Error while fetching devices" });
  }
}
