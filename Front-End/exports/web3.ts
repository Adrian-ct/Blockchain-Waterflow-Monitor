import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import WaterFlow from "back-end/artifacts/contracts/Waterflow.sol/Waterflow.json";
import { AbiItem } from "web3-utils";

const web3 = new Web3("http://127.0.0.1:8545");
const contract: Contract = new web3!.eth.Contract(
  WaterFlow.abi as AbiItem[],
  "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
);
export { contract, web3 };
