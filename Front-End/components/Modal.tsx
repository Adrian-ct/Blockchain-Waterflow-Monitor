import { useRecoilState, useSetRecoilState } from "recoil";
import { alertBoxAtom, modalAtom } from "../atoms/atom";
import { useState } from "react";
import { web3, contract } from "../exports/web3";
import axios from "axios";
import { TransactionReceipt } from "web3-core";
import { log } from "console";

type Props = {
  email: string;
};

const Modal = ({ email }: Props) => {
  const setAlertBox = useSetRecoilState(alertBoxAtom);
  const [uid, setUid] = useState<string>("");
  const [alias, setAlias] = useState<string>("");
  const [modal, setModal] = useRecoilState(modalAtom);

  const submit = async () => {
    await addDevice();
    setUid("");
    setAlias("");
  };

  const addDevice = async () => {
    if (web3 && contract && email) {
      const res = await axios
        .post(
          "/api/addDevice",
          {
            email,
            uid,
            alias,
          },
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        )
        .then(function (response) {
          setAlertBox({
            show: true,
            message: response.data.msg,
            error: false,
          });
          setModal(false);
        })
        .catch(function (error) {
          console.log(error.response);
          setAlertBox({
            show: true,
            message: error.response?.data?.error || "An error occurred",
            error: true,
          });
          setModal(false);
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
            <span className="label-text">An alias for easier reading</span>
          </label>
          <label className="input-group">
            <span>Alias</span>
            <input
              type="text"
              placeholder="Bathroom"
              className="input input-bordered w-full"
              minLength={3}
              maxLength={50}
              required
              onChange={(e) => {
                setAlias(e.target.value);
              }}
              value={alias}
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
              className="input input-bordered w-full"
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
