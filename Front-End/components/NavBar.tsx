import NextLink from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import Avatar from "../images/man.png";
import { signOut, useSession } from "next-auth/react";
import { modalAtom } from "../atoms/atom";
import { useRecoilState } from "recoil";
import Modal from "./Modal";

const NavBar = () => {
  const [modal, setModal] = useRecoilState(modalAtom);
  const { data: session } = useSession();
  const { pathname } = useRouter();
  const pagesWithoutNavbar = ["/auth"];
  const renderNavbar = !pagesWithoutNavbar.includes(pathname);

  return renderNavbar ? (
    <div className="navbar fixed z-[100] top-0 left-0 bg-[#44b7ffb0] text-black">
      <div className="flex-1">
        <div className="text-xl px-4 inline-flex items-center text-center h-12 hover:bg-[#65656539] hover:border-l-0 rounded-xl font-bold text-blue-600">
          <NextLink href="/">
            <span className="mr-4 text-violet-700 font-extrabold italic">
              Blockchain
            </span>
            Water Flow
          </NextLink>
        </div>
      </div>
      {session ? (
        <div className="flex-none">
          <ul className="menu menu-horizontal gap-4 px-1">
            <li>
              <button
                onClick={() => setModal(true)}
                className="btn btn-secondary text-white"
              >
                Add new device
              </button>
            </li>
            <li className="hover:bg-blue-400 hover:text-white transition-colors ease-linear duration-75 rounded-xl font-bold text-blue-600">
              <NextLink href="/dashboard">Dashboard</NextLink>
            </li>
          </ul>
          <div className="dropdown dropdown-end ">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
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
            <Modal email={session?.user?.email ?? ""} />
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
