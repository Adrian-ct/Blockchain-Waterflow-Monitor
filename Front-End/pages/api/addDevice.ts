// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { log } from "console";
import { ResponseData } from "../../types/fullstack";
import User from "../../model/User";
import { web3, contract } from "../../exports/web3";
import Device from "../../model/Device";
import { getSession } from "next-auth/react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return res
      .status(200)
      .json({ error: "This API call only accepts POST methods" });
  }
  const uid = req.body.uid.trim();
  const alias = req.body.alias?.trim();

  const session = await getSession({ req });
  if (!session) return res.status(400).json({ error: "User not logged in" });

  log("session", session);

  const user = await User.findOne({ email: session.user?.email });

  if (!user) return res.status(400).json({ error: "User not found" });

  const privateKeyEncrypted = JSON.parse(user.privateKey);
  const account = web3.eth.accounts.decrypt(
    privateKeyEncrypted,
    process.env.WEB3_SECRET as string
  );
  try {
    const deviceExists = await contract.methods
      .checkDeviceExists(uid)
      .call({ from: account.address });
    if (deviceExists) {
      log("Device already exists");
      return res.status(400).json({ error: "Device already exists" });
    }

    const txObject = await contract.methods.addDevice(uid);
    const gasPrice = await web3.eth.getGasPrice();
    const gasLimit = await txObject.estimateGas({ from: account.address });

    const transaction = {
      to: contract.options.address,
      data: txObject.encodeABI(),
      gasPrice,
      gasLimit,
      from: account.address,
    };
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

  //add the device and alias to mongo db
  const device = await Device.findOne({ uid: uid });
  if (!device) {
    const newDevice = new Device({
      uid: uid,
      alias: alias,
    });
    await newDevice.save();
  }

  res.status(200).json({ msg: "Device added succesfully" });
}
