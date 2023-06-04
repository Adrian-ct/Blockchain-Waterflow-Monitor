import { useRecoilState, useSetRecoilState } from "recoil";
import { modalAtom } from "../atoms/atom";
import { useState } from "react";
import { web3, contract } from "../exports/web3";
import axios from "axios";
import showToastMessage from "../utils/showToastMessage";
import { useSession } from "next-auth/react";

const Modal = () => {
  const [uid, setUid] = useState<string>("");
  const [alias, setAlias] = useState<string>("");
  const [modal, setModal] = useRecoilState(modalAtom);

  const addDevice = async () => {
    if (web3 && contract ) {
      await axios
        .post(
          "/api/addDevice",
          {
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
          showToastMessage(response.data.msg, "success");
          setModal(false);

          //Reset states
          setUid("");
          setAlias("");
        })
        .catch(function (error) {
          showToastMessage(error.response?.data?.error, "error");
          setModal(false);
        });
    }
  };

  return (
    <div className={`modal ${modal ? "modal-open" : ""}`}>
      <div className="modal-box bg-white">
        <h3 className="font-bold text-lg text-center text-blue-600">
          Add the details necessary to add a new device
        </h3>
        <div className="form-control text-white">
          <label className="label">
            <span className="label-text text-gray-600">
              An alias for easier reading
            </span>
          </label>
          <label className="input-group">
            <span className="bg-white w-20 border-blue-300 shadow-lg border-solid border-2 text-black font-bold">
              Alias
            </span>
            <input
              type="text"
              placeholder="Bathroom"
              className="input input-bordered w-full bg-sky-500"
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
            <span className="label-text text-gray-600">
              Device&apos;s Unique ID (Can be found on the back)
            </span>
          </label>
          <label className="input-group">
            <span className="bg-white w-20 border-blue-300 shadow-lg border-solid border-2 text-black font-bold">
              UID
            </span>
            <input
              type="password"
              minLength={8}
              maxLength={16}
              required
              placeholder="********"
              className="input input-bordered w-full bg-sky-500"
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
              className="btn btn-ghost text-black"
            >
              Cancel
            </button>
            <button
              onClick={async () => await addDevice()}
              className="btn btn-info text-white"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
