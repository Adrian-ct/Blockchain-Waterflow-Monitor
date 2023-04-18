import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import WaterFlow from "back-end/artifacts/contracts/Waterflow.sol/Waterflow.json";
import { AbiItem } from "web3-utils";

const web3 = new Web3("ws://127.0.0.1:8545");
const contract: Contract = new web3!.eth.Contract(
  WaterFlow.abi as AbiItem[],
  "0x5FbDB2315678afecb367f032d93F642f64180aa3"
);
export { contract, web3 };
