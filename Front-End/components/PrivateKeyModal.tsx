import { MouseEvent, useState } from "react";
import showToastMessage from "../utils/showToastMessage";
import { HiOutlineClipboardDocument } from "react-icons/hi2";

type SetActive = React.Dispatch<React.SetStateAction<boolean>>;

type Props = {
  active: boolean;
  setActive: SetActive;
  publicKey: string;
  privateKey: string;
};

const PrivateKeyModal = ({
  active,
  setActive,
  publicKey,
  privateKey,
}: Props) => {
  const copyToClipboard = (e: MouseEvent<SVGElement>, text: string) => {
    navigator.clipboard.writeText(text);
    showToastMessage("Copied to clipboard", "success");
  };

  return (
    <div className={`modal  ${active ? "modal-open" : ""}`}>
      <div className="modal-box bg-white w-3/6 max-w-full">
        <h3 className="font-bold text-lg text-center text-blue-600 mb-6">
          Please remember those keys as they are not stored anywhere
          <br /> and cannot be recovered
          <br />
          This is the only time you will see this popup
        </h3>
        <div className="form-control text-white ">
          <label className="label">
            <span className="label-text text-red-600 font-bold">
              This is a very important key, please keep it safe and do not share
            </span>
          </label>
          <label className="input-group">
            <span className="bg-white w-32 flex-none border-blue-300 shadow-lg border-solid border-2 text-black font-bold">
              Private Key
            </span>
            <input
              type="text"
              className="input input-bordered w-full bg-sky-500 "
              defaultValue={privateKey}
              readOnly={true}
            />
            <span className="bg-white w-fit border-blue-300 shadow-lg border-solid border-2 ">
              <HiOutlineClipboardDocument
                onClick={(e) => copyToClipboard(e, privateKey)}
                className="h-11 text-blue-600 w-full hover:cursor-pointer"
              />
            </span>
          </label>
          <label className="label">
            <span className="label-text text-blue-600 font-bold">
              This key can be shared with others
            </span>
          </label>
          <label className="input-group">
            <span className="bg-white w-32 flex-none border-blue-300 shadow-lg border-solid border-2 text-black font-bold">
              Public Key
            </span>
            <input
              type="text"
              className="input input-bordered w-full bg-sky-500"
              defaultValue={publicKey}
              readOnly={true}
            />
            <span className="bg-white w-fit border-blue-300 shadow-lg border-solid border-2 ">
              <HiOutlineClipboardDocument
                onClick={(e) => copyToClipboard(e, publicKey)}
                className="h-11 text-blue-600 w-full hover:cursor-pointer"
              />
            </span>
          </label>
        </div>
        <div className="modal-action mr-auto">
          <button
            onClick={() => setActive(false)}
            className="btn btn-error text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivateKeyModal;
