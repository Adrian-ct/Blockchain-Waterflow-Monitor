import { ethers } from "hardhat";
//let address = "";
async function main() {
  const WaterFlow = await ethers.getContractFactory("WaterFlow");
  const waterFlow = await WaterFlow.deploy();

  await waterFlow.deployed();

  console.log(`Contract deployed to ${waterFlow.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

//export default address;
