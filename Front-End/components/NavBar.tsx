import NextLink from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import Avatar from "../images/man.png";
import { signOut, useSession } from "next-auth/react";
import { modalAtom } from "../atoms/atom";
import { useRecoilState } from "recoil";

const NavBar = () => {
  const [modal, setModal] = useRecoilState(modalAtom);
  const { data: session } = useSession();
  const { pathname } = useRouter();
  const pagesWithoutNavbar = ["/auth"];
  const renderNavbar = !pagesWithoutNavbar.includes(pathname);

  return renderNavbar ? (
    <div className="navbar fixed bg-[#e1e1e1] text-black">
      <div className="flex-1">
        <button className="btn btn-ghost normal-case text-xl">
          <NextLink href="/">Water Flow</NextLink>
        </button>
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
            <li>
              <a>Item 3</a>
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
                <a className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </a>
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
