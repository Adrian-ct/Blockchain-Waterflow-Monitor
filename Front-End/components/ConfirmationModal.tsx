import { MouseEvent, useState } from "react";
import axios from "axios";
import showToastMessage from "../utils/showToastMessage";
import { useSession } from "next-auth/react";
import { contact } from "../types/fullstack";

type setActive = (value: boolean | ((prevState: boolean) => boolean)) => void;
type confirmation = () => void;
type Props = {
  active: boolean;
  setActive: setActive;
  confirmation: confirmation;
};

const ConfirmationModal = ({ active, setActive, confirmation }: Props) => {
  const { data: session } = useSession();

  //   const deleteContact = async (event: MouseEvent<HTMLButtonElement>) => {
  //     let button = event.currentTarget;
  //     button.disabled = true;
  //     let userEmail = session?.user?.email;

  //     try {
  //       const response = await axios.post(
  //         "/api/createContact",
  //         {
  //           name,
  //           contactEmail: email,
  //           phoneNumber: phone,
  //           avatar: selectedImage,
  //           userEmail,
  //         },
  //         {
  //           headers: {
  //             Accept: "application/json",
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );
  //       setContacts([...contacts, response.data.msg as contact]);
  //       showToastMessage("Contact created succesfully", "success");
  //     } catch (error: any) {
  //       console.log(error.response?.data?.error);

  //       showToastMessage(error.response?.data?.error, "error");
  //       setActive((prev) => !prev);
  //       button.disabled = false;
  //     }

  //     setActive((prev) => !prev);
  //     button.disabled = false;
  //     resetStates();
  //   };

  return (
    <div className={`modal ${active ? "modal-open" : ""}`}>
      <div className="modal-box bg-white">
        <h3 className="font-bold text-lg text-center ">
          Are you sure you want to delete this contact?
        </h3>
        <div className="flex justify-between items-center">
          <div className="modal-action ml-auto">
            <button
              onClick={() => confirmation()}
              className="btn btn-error text-white"
            >
              Yes
            </button>
            <button
              onClick={() => setActive(false)}
              className="btn btn-info text-white"
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
