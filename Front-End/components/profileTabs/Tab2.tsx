import Image from "next/image";
import avatarw1 from "../../public/images/avatarw1.png";
import avatarm1 from "../../public/images/avatarm1.png";
import avatarm2 from "../../public/images/avatarm2.png";
import { useState } from "react";
import { StaticImageData } from "next/image";
import AddContactModal from "../AddContactModal";

type Contact = {
  name: string;
  email: string;
  phoneNumber: string;
  avatar?: StaticImageData;
};

const contacts: Contact[] = [
  {
    name: "John Doe",
    email: "mail1@yahoo.com",
    phoneNumber: "1234567890",
    avatar: avatarm1,
  },
  {
    name: "Jane Doe",
    email: "mail2@yahoo.com",
    phoneNumber: "1234567890",
    avatar: avatarw1,
  },
  {
    name: "John Smith",
    email: "mail3@yahoo.com",
    phoneNumber: "1234567890",
    avatar: avatarm2,
  },
];

const Tab2 = () => {
  const [contactModal, setContactModal] = useState<boolean>(false);
  return (
    <>
      <AddContactModal active={contactModal} setActive={setContactModal} />
      {contacts.length ? (
        <div className="grid grid-cols-2 gap-2">
          {contacts.map((contact, idx) => (
            <div
              key={idx}
              className="card lg:card-side glass shadow-xl max-w-lg"
            >
              <figure>
                <Image
                  className="h-full"
                  src={contact.avatar || avatarw1}
                  alt="Album"
                />
              </figure>
              <div className="card-body w-full text-white">
                <h2 className="card-title">{contact.name}</h2>
                <p>Phone Number: {contact.phoneNumber}</p>
                <div className="card-actions justify-center">
                  <button
                    onClick={() => setContactModal((prev) => !prev)}
                    className="btn btn-primary"
                  >
                    Email Alert
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>No contacts</div>
      )}
    </>
  );
};

export default Tab2;
