import Image from "next/image";
import avatarm1 from "../../public/images/avatarm1.png";
import avatarm2 from "../../public/images/avatarm2.png";
import avatarw1 from "../../public/images/avatarw1.png";
import avatarw2 from "../../public/images/avatarw2.png";
import { useState, useRef, useEffect } from "react";
import { StaticImageData } from "next/image";
import AddContactModal from "../AddContactModal";
import SendMessageModal from "../SendMessageModal";
import axios from "axios";
import { useSession } from "next-auth/react";
import { contact } from "../../types/fullstack";
import EmptyPlaceholder from "../EmptyPlaceholder";

const avatarMap: { [key: string]: StaticImageData } = {
  avatarm1,
  avatarm2,
  avatarw1,
  avatarw2,
};

const Tab2 = () => {
  const [contactModal, setContactModal] = useState<boolean>(false);
  const [messageModal, setMessageModal] = useState<boolean>(false);
  const [contacts, setContacts] = useState<contact[]>([]);
  const { data: session } = useSession();
  let contactEmail = useRef("");

  const sendMessageHandler = async (email: string) => {
    contactEmail.current = email;
    setMessageModal((prev) => !prev);
  };

  const getAllContacts = async () => {
    let email = session?.user?.email;
    try {
      const response = await axios.get("/api/getContacts", {
        params: {
          email,
        },
      });
      setContacts(response.data.msg as contact[]);
    } catch (error: any) {
      console.log(error.response?.data?.error);
    }
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
      <AddContactModal
        active={contactModal}
        setActive={setContactModal}
        setContacts={setContacts}
        contacts={contacts}
      />
      <SendMessageModal
        active={messageModal}
        setActive={setMessageModal}
        contactEmail={contactEmail.current}
      />
      <button
        className="btn bg-white text-blue-800 font-bold border-none hover:bg-primary hover:text-white transition-colors duration-300 ease-in"
        onClick={() => setContactModal((prev) => !prev)}
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
                <div className="card-actions justify-center">
                  <button
                    className="btn btn-primary"
                    onClick={() => sendMessageHandler(contact.email)}
                  >
                    Email Alert
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
