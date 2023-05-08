import { useState } from "react";
import { web3, contract } from "../exports/web3";
import axios from "axios";
import showToastMessage from "../utils/showToastMessage";
import { useSession } from "next-auth/react";

type SetActive = (value: boolean | ((prevState: boolean) => boolean)) => void;

type Props = {
  active: boolean;
  setActive: SetActive;
};

const maximumMessageLength = 750;
const AddContactModal = ({ active, setActive }: Props) => {
  const { data: session } = useSession();
  const [uid, setUid] = useState<string>("");
  const [alias, setAlias] = useState<string>("");

  const [message, setMessage] = useState<string>("");

  const submit = async () => {
    await addDevice();
    setUid("");
    setAlias("");
  };

  const addDevice = async () => {
    if (web3 && contract && session?.user?.email) {
      const email = session?.user?.email;
      await axios
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
          showToastMessage(response.data.msg, "success");
          //setModal(false);
        })
        .catch(function (error) {
          showToastMessage(error.response?.data?.error, "error");
          //setModal(false);
        });
    }
  };

  return (
    <div className={`modal ${active ? "modal-open" : ""}`}>
      <div className="modal-box bg-white">
        <h3 className="font-bold text-lg text-center text-blue-600">
          Add the necessary details
          <br /> for adding a new contact person
        </h3>
        <div className="form-control text-white">
          <label className="label">
            <span className="label-text text-gray-600">Name</span>
          </label>
          <label className="input-group">
            <span className="bg-white w-20 flex-none border-blue-300 shadow-lg border-solid border-2 text-black font-bold">
              Name
            </span>
            <input
              type="text"
              placeholder="John Doe"
              className="input input-bordered w-full bg-sky-500 placeholder:text-stone-300"
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
              Person&apos;s email
            </span>
          </label>
          <label className="input-group">
            <span className="bg-white w-20 flex-none border-blue-300 shadow-lg border-solid border-2 text-black font-bold">
              Email
            </span>
            <input
              type="text"
              minLength={8}
              maxLength={16}
              required
              placeholder="whatever@gmail.com"
              className="input input-bordered w-full bg-sky-500 placeholder:text-stone-300"
              onChange={(e) => {
                setUid(e.target.value);
              }}
              value={uid}
            />
          </label>
          <label className="label">
            <span className="label-text text-gray-600">Phone Number</span>
          </label>
          <label className="input-group">
            <span className="bg-white w-20 flex-none border-blue-300 shadow-lg border-solid border-2 text-black font-bold">
              Phone
            </span>
            <input
              type="tel"
              minLength={10}
              maxLength={10}
              required
              placeholder="..."
              className="input input-bordered w-full bg-sky-500 placeholder:text-stone-300"
              onChange={(e) => {
                setUid(e.target.value);
              }}
              value={uid}
            />
          </label>
          <div className="form-control">
            <label className="label">
              <span className="label-text text-gray-600">Your message</span>
            </label>
            <textarea
              className="textarea textarea-bordered h-24 bg-sky-500 placeholder:text-stone-300"
              maxLength={maximumMessageLength}
              placeholder="Hey Mr/Mrs..."
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            ></textarea>
            <label className="label">
              <span className="label-text-alt">Characters</span>
              <span className="label-text-alt">{`${message.length}/${maximumMessageLength}`}</span>
            </label>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="modal-action ml-auto">
            <button
              onClick={() => setActive((prev) => !prev)}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            <button onClick={submit} className="btn btn-info text-white">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddContactModal;
