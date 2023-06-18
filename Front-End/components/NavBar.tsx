import NextLink from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Avatar from "../images/man.png";
import { signOut, useSession } from "next-auth/react";
import { blockchainKeysAtom, modalAtom } from "../atoms/atom";
import { useRecoilState, useRecoilValue } from "recoil";
import Modal from "./AddDeviceModal";
import { AiOutlinePlusCircle } from "react-icons/ai";
import PrivateKeyModal from "./PrivateKeyModal";
import ethereum from "../public/images/ethereum.png";

const NavBar = () => {
  const [modal, setModal] = useRecoilState(modalAtom);
  const { data: session } = useSession();
  const { pathname } = useRouter();
  const pagesWithoutNavbar = ["/auth"];
  const renderNavbar = !pagesWithoutNavbar.includes(pathname);

  //Private key modal
  const [privateKeyModal, setPrivateKeyModal] = useState<boolean>(false);
  const [keysAtom, setKeysAtom] = useRecoilState(blockchainKeysAtom);

  useEffect(() => {
    if (keysAtom.show) {
      setKeysAtom((prev) => ({ ...prev, show: false }));
      setPrivateKeyModal(true);
    }
  }, [keysAtom.show]);

  return renderNavbar ? (
    <div className="navbar min-h-6 fixed z-[100] top-0 left-0 bg-white bg-opacity-100 border-b-4 border-b-[#00BD9D] text-black">
      <PrivateKeyModal
        active={privateKeyModal}
        setActive={setPrivateKeyModal}
        privateKey={keysAtom.privateKey}
        publicKey={keysAtom.publicKey}
      />
      <div className="flex-1">
        <div className="text-l px-4 inline-flex items-center text-center rounded-xl font-bold text-blue-600">
          <NextLink href="/">
            <button className="btn btn-ghost hover:bg-blue-600 hover:text-white text-base font-bold  transition-colors duration-300 ease-in">
              <Image
                src={ethereum}
                alt="ethereum"
                width={50}
                height={50}
                className="rounded-full bg-blend-color-burn"
              />
              Blockchain Waterflow Monitor
            </button>
          </NextLink>
        </div>
      </div>
      {session ? (
        <div className="flex-none">
          <ul className="menu menu-horizontal gap-4 px-1">
            <li>
              <button
                onClick={() => setModal(true)}
                className="btn py-0 bg-[#00BD9D] border-none hover:bg-[#00BD9D] text-white group"
              >
                <span className="transition group-hover:animate-bounce text-xs">
                  Add new device
                </span>
                <AiOutlinePlusCircle className="transition text-blue-800 text-xl group-hover:animate-spin" />
              </button>
            </li>
            <li className="rounded-xl font-bold text-blue-600  hover:bg-blue-600 hover:text-white">
              <NextLink href="/dashboard">Dashboard</NextLink>
            </li>
          </ul>
          <div className="dropdown dropdown-end ">
            <label
              tabIndex={0}
              className="btn btn-ghost btn-circle avatar hover:bg-blue-600"
            >
              <div className="w-10 rounded-full">
                <Image width={40} height={40} alt="profile" src={Avatar} />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-slate-200 rounded-box w-52"
            >
              <li>
                <NextLink href="/profile" className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </NextLink>
              </li>
              <li>
                <a
                  onClick={() =>
                    signOut({
                      redirect: false,
                    })
                  }
                >
                  Logout
                </a>
              </li>
            </ul>
            <Modal />
          </div>
        </div>
      ) : (
        <div>
          <div className="btn btn-ghost normal-case text-lg">
            <NextLink href="/auth">Login</NextLink>
          </div>
        </div>
      )}
    </div>
  ) : null;
};

export default NavBar;
