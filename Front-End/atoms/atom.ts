import { atom } from "recoil";
import { BlockchainKeysModal } from "../types/fullstack";

export const modalAtom = atom({
  key: "modalAtom", // unique ID (with respect to other atoms/selectors)
  default: false, // default value (aka initial value)
});

export const blockchainKeysAtom = atom({
  key: "blockchainKeysAtom",
  default: {
    publicKey: "",
    privateKey: "",
    show: false,
  } as BlockchainKeysModal,
});
