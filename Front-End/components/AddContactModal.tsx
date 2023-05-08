import { MouseEvent, useState } from "react";
import axios from "axios";
import showToastMessage from "../utils/showToastMessage";
import { useSession } from "next-auth/react";
import Image from "next/image";
import avatarw1 from "../public/images/avatarw1.png";
import avatarw2 from "../public/images/avatarw2.png";
import avatarm1 from "../public/images/avatarm1.png";
import avatarm2 from "../public/images/avatarm2.png";
import { contact } from "../types/fullstack";

type setActive = (value: boolean | ((prevState: boolean) => boolean)) => void;
type setContacts = (
  value: contact[] | ((prevState: contact[]) => contact[])
) => void;

type Props = {
  active: boolean;
  setActive: setActive;
  setContacts: setContacts;
  contacts: contact[];
};

const AddContactModal = ({
  active,
  setActive,
  setContacts,
  contacts,
}: Props) => {
  const { data: session } = useSession();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [showPictures, setShowPictures] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string>("");

  const resetStates = () => {
    setName("");
    setEmail("");
    setPhone("");
    setSelectedImage("");
    setShowPictures(false);
  };

  const addContact = async (event: MouseEvent<HTMLButtonElement>) => {
    let button = event.currentTarget;
    button.disabled = true;
    let userEmail = session?.user?.email;

    try {
      const response = await axios.post(
        "/api/createContact",
        {
          name,
          contactEmail: email,
          phoneNumber: phone,
          avatar: selectedImage,
          userEmail,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      setContacts([...contacts, response.data.msg as contact]);
      showToastMessage("Contact created succesfully", "success");
    } catch (error: any) {
      console.log(error.response?.data?.error);

      showToastMessage(error.response?.data?.error, "error");
      setActive((prev) => !prev);
      button.disabled = false;
    }

    setActive((prev) => !prev);
    button.disabled = false;
    resetStates();
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
              minLength={2}
              maxLength={50}
              required
              onChange={(e) => {
                setName(e.target.value);
              }}
              value={name}
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
              minLength={5}
              maxLength={254}
              required
              placeholder="whatever@gmail.com"
              className="input input-bordered w-full bg-sky-500 placeholder:text-stone-300"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
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
              maxLength={15}
              required
              placeholder="..."
              className="input input-bordered w-full bg-sky-500 placeholder:text-stone-300"
              onChange={(e) => {
                setPhone(e.target.value);
              }}
              value={phone}
            />
          </label>
        </div>
        <label className="label">
          <button
            className="btn text-center w-full btn-link text-gray-600"
            onClick={() => setShowPictures((prev) => !prev)}
          >
            Choose an avatar for the contact
          </button>
        </label>
        {showPictures && (
          <div className="grid grid-cols-2  ">
            <Image
              src={avatarw1}
              alt="Avatar"
              className={`w-full h-full object-cover ${
                selectedImage === "avatarw1"
                  ? "border-red-600 border-4"
                  : "border-black border-2"
              } border-2 border-solid`}
              onClick={() => setSelectedImage("avatarw1")}
            />
            <Image
              src={avatarw2}
              alt="Avatar"
              className={`w-full h-full object-cover ${
                selectedImage === "avatarw2"
                  ? "border-red-600 border-4"
                  : "border-black border-2"
              }  border-solid`}
              onClick={() => setSelectedImage("avatarw2")}
            />
            <Image
              src={avatarm1}
              alt="Avatar"
              className={`w-full h-full object-cover ${
                selectedImage === "avatarm1"
                  ? "border-red-600 border-4"
                  : "border-black border-2"
              } border-2 border-solid`}
              onClick={() => setSelectedImage("avatarm1")}
            />
            <Image
              src={avatarm2}
              alt="Avatar"
              className={`w-full h-full object-cover ${
                selectedImage === "avatarm2"
                  ? "border-red-600 border-4"
                  : "border-black border-2"
              } border-2 border-solid`}
              onClick={() => setSelectedImage("avatarm2")}
            />
          </div>
        )}
        <div className="flex justify-between items-center">
          <div className="modal-action ml-auto">
            <button
              onClick={() => {
                setActive((prev) => !prev);
                resetStates();
              }}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            <button onClick={addContact} className="btn btn-info text-white">
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddContactModal;
