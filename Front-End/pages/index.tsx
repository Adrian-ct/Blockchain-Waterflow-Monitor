import type { NextPage } from "next";
import { useSession, signOut } from "next-auth/react";
import Modal from "../components/Modal";
//Signed in as {session?.user?.email}

const Background = ({ children }: any) => {
  return (
    <div className="flex justify-center h-screen w-full items-center bg-[url('../images/bg.svg')] bg-cover text-black">
      {children}
    </div>
  );
};

const Home: NextPage = () => {
  const { data: session } = useSession();

  if (session) {
    return (
      <Background>
        <Modal />
        <button className="btn btn-accent text-xl capitalize">Welcome</button>
      </Background>
    );
  } else {
    return <Background>Hello</Background>;
  }
};

export default Home;
