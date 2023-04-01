// callContract.ts
import { web3, contract } from "../exports/web3";
import { getPrivateKey } from "./getPrivateKey";

export async function callContract(
  email: string,
  uid: string,
  setAlertBox: Function,
  setModal: Function
): Promise<void> {
  const privateKey = await getPrivateKey(email);

  if (privateKey) {
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    const accountAddress = account?.address;

    try {
      await contract.methods.addDevice(uid).send({ from: accountAddress });

      setAlertBox({
        show: true,
        message: `Device with id ${uid} added successfully`,
      });

      //   const devices = await contract.methods
      //     .getDeviceIDsByUser(accountAddress)
      //     .call();
      //   console.log(devices);

      setModal(false);
    } catch (err) {
      const errorMessage = err?.stack?.match(/'([^']+)'/)?.[1];
      console.error(errorMessage);
    }
  }
}
