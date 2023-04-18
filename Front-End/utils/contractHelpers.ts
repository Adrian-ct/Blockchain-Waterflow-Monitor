import { contract } from "../exports/web3";

export async function getDevices(publicKey: string): Promise<string[]> {
  const devices = await contract.methods
    .getDeviceIDsByUser(publicKey)
    .call({ from: publicKey });
  return devices;
}
