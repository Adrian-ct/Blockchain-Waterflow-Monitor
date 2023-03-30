import { useRecoilState, useSetRecoilState } from "recoil";
import { alertBoxAtom, modalAtom } from "../atoms/atom";
import { useState } from "react";
import { web3, contract } from "../exports/web3";
import axios from "axios";
import { TransactionReceipt } from "web3-core";

type Props = {
  email: string;
};

const Modal = ({ email }: Props) => {
  const setAlertBox = useSetRecoilState(alertBoxAtom);
  const [uid, setUid] = useState<string>("");
  const [modal, setModal] = useRecoilState(modalAtom);

  const submit = async () => {
    await callContract();
  };

  const callContract = async () => {
    if (web3 && contract && email) {
      const res = await axios
        .get("/api/getPrivateKey", { params: { email } })
        .then(function (response) {
          return response.data;
        })
        .catch(function (error) {
          console.log(error);
        });

      const account = web3?.eth.accounts.privateKeyToAccount(res);
      const accountAddress = account?.address;

      contract?.methods
        .addDevice(uid)
        .send({
          from: accountAddress,
        })
        .then(async (res: TransactionReceipt) => {
          setAlertBox({
            show: true,
            message: `Device with id ${uid} added successfully`,
          });
          const devices = await contract?.methods
            .getDeviceIDsByUser(accountAddress)
            .call();
          console.log(devices);
          setModal(false);
        })
        .catch((err: Error) => {
          const errorMessage = err?.stack?.match(/'([^']+)'/)?.[1];
          console.error(errorMessage);
        });
    }
  };

  return (
    <div className={`modal  ${modal ? "modal-open" : ""}`}>
      <div className="modal-box bg-white">
        <h3 className="font-bold text-lg text-center">
          Add the details necessary to add a new device
        </h3>
        <div className="form-control text-white">
          <label className="label">
            <span className="label-text">Your Email</span>
          </label>
          <label className="input-group">
            <span>Email</span>
            <input
              type="text"
              placeholder="info@site.com"
              className="input input-bordered"
              required
              // onChange={(e) => {
              //   setEmail(e.target.value);
              // }}
              // value={email}
            />
          </label>
          <label className="label">
            <span className="label-text">
              Device's Unique ID (Can be found on the back)
            </span>
          </label>
          <label className="input-group">
            <span>UID</span>
            <input
              type="password"
              minLength={8}
              maxLength={16}
              required
              placeholder="********"
              className="input input-bordered"
              onChange={(e) => {
                setUid(e.target.value);
              }}
              value={uid}
            />
          </label>
        </div>
        <div className="flex justify-between items-center">
          <div className="modal-action ml-auto">
            <button
              onClick={() => setModal((old) => !old)}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            <button onClick={submit} className="btn btn-accent">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
