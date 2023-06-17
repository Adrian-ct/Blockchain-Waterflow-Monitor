import Image from "next/image";
import avatarm1 from "../../public/images/avatarm1.png";
import avatarm2 from "../../public/images/avatarm2.png";
import avatarw1 from "../../public/images/avatarw1.png";
import avatarw2 from "../../public/images/avatarw2.png";
import { useState, useRef, useEffect } from "react";
import { StaticImageData } from "next/image";
import SendMessageModal from "../SendMessageModal";
import axios from "axios";
import { useSession } from "next-auth/react";
import { contact } from "../../types/fullstack";
import EmptyPlaceholder from "../EmptyPlaceholder";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin5Line, RiMailSendLine } from "react-icons/ri";
import ConfirmationModal from "../ConfirmationModal";
import showToastMessage from "../../utils/showToastMessage";
import MaintainContactModal from "../MaintainContactModal";

const avatarMap: { [key: string]: StaticImageData } = {
  avatarm1,
  avatarm2,
  avatarw1,
  avatarw2,
};

type contactRef = {
  email: string;
  type: "create" | "update";
};

const Tab2 = () => {
  //Modals
  const [contactModal, setContactModal] = useState<boolean>(false);
  const [messageModal, setMessageModal] = useState<boolean>(false);
  const [deleteContactModal, setDeleteContactModal] = useState<boolean>(false);

  //States
  const [contacts, setContacts] = useState<contact[]>([]);

  //Session
  const { data: session } = useSession();

  let contactEmail = useRef<contactRef>({
    email: "",
    type: "create",
  });

  const sendMessageHandler = async (email: string) => {
    contactEmail.current.email = email;
    setMessageModal((prev) => !prev);
  };

  const getAllContacts = async () => {
    try {
      const response = await axios.get("/api/getContacts");
      setContacts(response.data.msg as contact[]);
    } catch (error: any) {
      console.log(error.response?.data?.error);
    }
  };

  const deleteContactHandler = async () => {
    try {
      const response = await axios.delete("/api/removeContact", {
        params: {
          contactEmail: contactEmail.current.email,
        },
      });
      setContacts((prev) =>
        prev.filter((contact) => contact.email !== contactEmail.current.email)
      );
      showToastMessage(response.data.msg as string, "success");
    } catch (error: any) {
      showToastMessage(error.response?.data?.error, "error");
    }
    setDeleteContactModal((prev) => !prev);
  };

  useEffect(() => {
    if (!session?.user?.email || contacts.length) return;

    const getAllContactsHandler = async () => {
      await getAllContacts();
    };
    getAllContactsHandler();
  }, []);

  return (
    <>
      <ConfirmationModal
        setActive={setDeleteContactModal}
        active={deleteContactModal}
        confirmation={deleteContactHandler}
      />
      <MaintainContactModal
        active={contactModal}
        setActive={setContactModal}
        setContacts={setContacts}
        contacts={contacts}
        action={contactEmail.current.type}
        contactEmail={
          contactEmail.current.type === "update"
            ? contactEmail.current.email
            : undefined
        }
      />
      <SendMessageModal
        active={messageModal}
        setActive={setMessageModal}
        contactEmail={contactEmail.current.email}
      />
      <button
        className="btn bg-white text-blue-800 font-bold border-none hover:bg-primary hover:text-white transition-colors duration-300 ease-in"
        onClick={() => {
          contactEmail.current.type = "create";
          setContactModal((prev) => !prev);
        }}
      >
        Add a new contact
      </button>
      {contacts.length ? (
        <div className="grid grid-cols-2 gap-2">
          {contacts.map((contact, idx) => (
            <div
              key={idx}
              className="card lg:card-side glass shadow-xl max-w-lg"
            >
              <figure className="w-[50%]">
                <Image
                  className="h-full"
                  src={avatarMap[contact.avatar] as StaticImageData}
                  alt="Album"
                />
              </figure>
              <div className="card-body w-full text-white">
                <h2 className="card-title">{contact.name}</h2>
                <p>Phone Number: {contact.phoneNumber}</p>
                <div className="card-actions justify-center gap-4 mt-4">
                  <button
                    className="btn btn-error text-white"
                    onClick={() => {
                      contactEmail.current.email = contact.email;
                      setDeleteContactModal((prev) => !prev);
                    }}
                  >
                    <RiDeleteBin5Line className="w-5 h-auto" />
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => sendMessageHandler(contact.email)}
                  >
                    <RiMailSendLine className="w-5 h-auto" />
                  </button>
                  <button
                    className="btn btn-accent"
                    onClick={() => {
                      contactEmail.current.type = "update";
                      contactEmail.current.email = contact.email;
                      setContactModal((prev) => !prev);
                    }}
                  >
                    <FiEdit className="w-5 h-auto" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyPlaceholder text="Looks like you don't have any contacts :(" />
      )}
    </>
  );
};

export default Tab2;
