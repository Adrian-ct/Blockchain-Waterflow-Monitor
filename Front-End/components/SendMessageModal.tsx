import { MouseEvent, useState } from "react";
import axios from "axios";
import showToastMessage from "../utils/showToastMessage";
import { useSession } from "next-auth/react";

type SetActive = (value: boolean | ((prevState: boolean) => boolean)) => void;

type Props = {
  active: boolean;
  setActive: SetActive;
  contactEmail: string;
};

const maximumMessageLength = 750;
const SendMessageModal = ({ active, setActive, contactEmail }: Props) => {
  const { data: session } = useSession();
  const [subject, setSubject] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const submit = async () => {
    // await addDevice();
    // setUid("");
    // setAlias("");
  };

  const addContact = async (event: MouseEvent<HTMLButtonElement>) => {
    showToastMessage("This feature is not available yet", "error");
    //setActive((prev) => !prev);
    //event.currentTarget.disabled = true;

    // if (web3 && contract && session?.user?.email) {
    //   const email = session?.user?.email;
    //   await axios
    //     .post(
    //       "/api/addDevice",
    //       {
    //         email,
    //         uid,
    //         alias,
    //       },
    //       {
    //         headers: {
    //           Accept: "application/json",
    //           "Content-Type": "application/json",
    //         },
    //       }
    //     )
    //     .then(function (response) {
    //       showToastMessage(response.data.msg, "success");
    //       //setModal(false);
    //     })
    //     .catch(function (error) {
    //       showToastMessage(error.response?.data?.error, "error");
    //       //setModal(false);
    //     });
    // }
  };

  return (
    <div className={`modal ${active ? "modal-open" : ""}`}>
      <div className="modal-box bg-white">
        <h3 className="font-bold text-lg text-center text-blue-600 mb-6">
          Please fill out the form
          <br /> below to send a message
        </h3>
        <div className="form-control text-white">
          <label className="label">
            <span className="label-text text-gray-600">
              Try to write a meaningfull subject
            </span>
          </label>
          <label className="input-group">
            <span className="bg-white w-20 flex-none border-blue-300 shadow-lg border-solid border-2 text-black font-bold">
              Subject
            </span>
            <input
              type="text"
              placeholder="This is an important subject"
              className="input input-bordered w-full bg-sky-500 placeholder:text-stone-300"
              minLength={3}
              maxLength={50}
              required
              onChange={(e) => {
                setSubject(e.target.value);
              }}
              value={subject}
            />
          </label>
          <label className="label">
            <span className="label-text text-gray-600">
              Contact person&apos;s email address
            </span>
          </label>
          <label className="input-group">
            <span className="bg-white w-20 flex-none border-blue-300 shadow-lg border-solid border-2 text-black font-bold">
              Email
            </span>
            <input
              type="text"
              placeholder="....@gmail.com"
              className="input input-bordered w-full bg-sky-500 placeholder:text-stone-300"
              minLength={3}
              maxLength={50}
              required
              contentEditable={false}
              defaultValue={contactEmail}
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
            <button onClick={addContact} className="btn btn-info text-white">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendMessageModal;
