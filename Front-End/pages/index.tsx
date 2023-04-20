import type { NextPage } from "next";
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { alertBoxAtom } from "../atoms/atom";
import Background from "../components/Background";
import Modal from "../components/Modal";
import ExchangeRates from "../components/index/ExchangeRates";

const Home: NextPage = () => {
  const { data: session } = useSession();
  const [alertBox, setAlertBox] = useRecoilState(alertBoxAtom);

  useEffect(() => {
    let timer = setTimeout(
      () => setAlertBox({ show: false, message: "", error: false }),
      4000
    );
    return () => clearTimeout(timer);
  }, [alertBox.show]);

  if (session) {
    return (
      <div className="flex justify-center items-center h-72">
        <Modal email={session?.user?.email ?? ""} />
        <ExchangeRates />
      </div>
    );
  } else {
    return (
      <Background>
        <h1 className="text-white text-3xl text-center">
          Please Log In to see the information
        </h1>
      </Background>
    );
  }
};

export default Home;
