// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { log } from "console";
import { ResponseData } from "./register";
import User from "../../model/User";
import { web3, contract } from "../../exports/web3";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return res
      .status(200)
      .json({ error: "This API call only accepts POST methods" });
  }
  const email = req.body.email.trim();
  const uid = req.body.uid.trim();

  const user = await User.findOne({ email: email });

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
      res.status(400).json({ error: "Device already exists" });
      return;
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

  res.status(200).json({ msg: "Device added succesfully" });
}
