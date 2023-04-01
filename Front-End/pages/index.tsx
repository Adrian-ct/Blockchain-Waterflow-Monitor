import axios from "axios";
import type { NextPage } from "next";
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { alertBoxAtom, emailAtom } from "../atoms/atom";
import AlertBox from "../components/AlertBox";
import Background from "../components/Background";
import Modal from "../components/Modal";
//Signed in as {session?.user?.email}

// export const Background = ({ children }: any) => {
//   return (
//     <div className="flex justify-center h-screen w-full items-center bg-[url('../images/bg.svg')] bg-cover text-black">
//       {children}
//     </div>
//   );
// };

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

  const onClickHandler = async () => {
    let publicKey = "123456789";
    let deviceID = "123456789";
    const res2 = await axios
      .post(
        "/api/postDevices",
        {
          publicKey,
          deviceID,
          data: {
            waterflow: 20,
            date: new Date().toISOString(),
          },
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        console.log(error);
        return;
      });
  };

  const onClickHandler2 = async () => {
    //get request to get all devices
    let publicKey = "123456789";
    const res = await axios
      .get("/api/getDevices", { params: { publicKey } })
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        console.log(error);
      });
    console.log(res);
  };

  if (session) {
    return (
      <div className="flex justify-center items-center h-72">
        <Modal email={session?.user?.email ?? ""} />
        <button
          onClick={onClickHandler}
          className="btn btn-accent text-xl capitalize"
        >
          Post Devices
        </button>
        <button
          onClick={onClickHandler2}
          className="btn btn-warning ml-10 text-xl capitalize"
        >
          Get Devices
        </button>
        {alertBox.show && (
          <div className="fixed w-2/5 left-1/2 -translate-x-1/2 bottom-10">
            <AlertBox message={alertBox.message} error={alertBox.error} />{" "}
          </div>
        )}
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
