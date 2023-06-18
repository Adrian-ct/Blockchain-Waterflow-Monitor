// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../lib/dbConnect";
import User from "../../model/User";
import bcrypt from "bcrypt";
import { web3 } from "../../exports/web3";
import { log } from "console";
import { BlockchainKeysWithResponse } from "../../types/fullstack";

export const validateEmail = (email: string): boolean => {
  const regEx = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return regEx.test(email);
};

const validateForm = async (
  username: string,
  email: string,
  password: string
) => {
  if (username.length < 5) {
    return "Username must have 5 or more characters";
  }
  if (!validateEmail(email)) {
    return "Email is invalid";
  }

  await dbConnect();
  const emailUser = await User.findOne({ email: email });

  if (emailUser) {
    return "Email already exists";
  }

  if (password.length < 5) {
    return "Password must have 5 or more characters";
  }

  return null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BlockchainKeysWithResponse>
) {
  // validate if it is a POST
  if (req.method !== "POST") {
    return res.status(405).json({
      publicKey: "",
      privateKey: "",
      error: "This API call only accepts POST methods",
    });
  }

  // get and validate body variables
  const { username, email, password } = req.body;

  const errorMessage = await validateForm(username, email, password);
  if (errorMessage) {
    return res.status(400).json({
      publicKey: "",
      privateKey: "",
      error: errorMessage,
    });
  }

  let existingUser = await User.findOne({ email: email });
  if (existingUser) {
    return res.status(400).json({
      publicKey: "",
      privateKey: "",
      error: "Email already exists",
    });
  }
  existingUser = "";
  existingUser = await User.findOne({ username: username });
  if (existingUser) {
    return res.status(400).json({
      publicKey: "",
      privateKey: "",
      error: "Username already exists",
    });
  }

  //create a new web account for the user
  const newAccount = web3.eth.accounts.create();
  const encyptedPrivateKey = web3.eth.accounts.encrypt(
    newAccount.privateKey,
    process.env.WEB3_SECRET as string
  );

  log("newAccount", newAccount);

  // const encyptedPrivateKey = web3.eth.accounts.encrypt(
  //   "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
  //   process.env.WEB3_SECRET as string
  // );
  // hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // create new User on MongoDB
  const newUser = new User({
    username,
    email,
    hashedPassword,
    privateKey: JSON.stringify(encyptedPrivateKey),
    publicKey: newAccount.address,
  });

  try {
    await newUser.save();
    res.status(200).json({
      publicKey: newAccount.address,
      privateKey: newAccount.privateKey,
      message: "Successfuly created new User",
    });
  } catch (err) {
    res.status(500).json({
      privateKey: "",
      publicKey: "",
      error: "Error on '/api/register': " + err,
    });
  }
}
