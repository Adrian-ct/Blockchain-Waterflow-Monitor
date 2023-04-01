// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../lib/dbConnect";
import User from "../../model/User";
import bcrypt from "bcrypt";
import Account from "../../model/Account";
import { web3, contract } from "../../exports/web3";
import { log } from "console";

export interface ResponseData {
  error?: string;
  msg?: string;
}

export const validateEmail = (email: string): boolean => {
  const regEx = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return regEx.test(email);
};

const validateForm = async (
  username: string,
  email: string,
  password: string
) => {
  if (username.length < 3) {
    return { error: "Username must have 3 or more characters" };
  }
  if (!validateEmail(email)) {
    return { error: "Email is invalid" };
  }

  await dbConnect();

  const emailUser = await User.findOne({ email: email });

  if (emailUser) {
    return { error: "Email already exists" };
  }

  if (password.length < 5) {
    return { error: "Password must have 5 or more characters" };
  }

  return null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // validate if it is a POST
  if (req.method !== "POST") {
    return res
      .status(200)
      .json({ error: "This API call only accepts POST methods" });
  }

  // get and validate body variables
  const { username, email, password } = req.body;

  const errorMessage = await validateForm(username, email, password);
  if (errorMessage) {
    return res.status(400).json(errorMessage as ResponseData);
  }

  //create a new web account for the user
  // const newAccount = web3.eth.accounts.create();
  const encyptedPrivateKey = web3.eth.accounts.encrypt(
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
    process.env.WEB3_SECRET as string
  );
  // hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // create new User on MongoDB
  const newUser = new User({
    username,
    email,
    hashedPassword,
    privateKey: JSON.stringify(encyptedPrivateKey),
    publicKey: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  });

  newUser
    .save()
    .then(() => {
      res.status(200).json({ msg: "Successfuly created new User: " + newUser });
    })
    .catch((err: string) =>
      res.status(400).json({ error: "Error on '/api/register': " + err })
    );
}
