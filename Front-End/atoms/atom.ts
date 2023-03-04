import { atom } from "recoil";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";

export const modalAtom = atom({
  key: "modalAtom", // unique ID (with respect to other atoms/selectors)
  default: false, // default value (aka initial value)
});
