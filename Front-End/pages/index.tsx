import axios from "axios";
import type { NextPage } from "next";
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { alertBoxAtom } from "../atoms/atom";
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

  const onClickHandler4 = async () => {
    let deviceID = "1";
    await axios
      .post(
        "/api/addData",
        {
          deviceID,
          data: {
            waterflow: 25,
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
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error.response?.data?.error);
      });
  };

  const onClickGetDevices = async () => {
    let email = session?.user?.email ?? "";
    axios
      .get("/api/getDevices", { params: { email } })
      .then(function (response) {
        console.log(response.data.result);
      })
      .catch(function (error) {
        console.log(error.response?.data?.error);
      });
  };

  const onClickGetCID = async () => {
    let email = session?.user?.email ?? "";
    let deviceID = "1";
    axios
      .get("/api/getCIDs", { params: { email, deviceID } })
      .then(function (response) {
        console.log(response.data.result);
      })
      .catch(function (error) {
        console.log(error.response?.data?.error);
      });
  };

  if (session) {
    return (
      <div className="flex justify-center items-center h-72">
        <Modal email={session?.user?.email ?? ""} />
        <button
          onClick={onClickGetCID}
          className="btn btn-error ml-10 text-xl capitalize"
        >
          Get CIDs
        </button>
        <button
          onClick={onClickGetDevices}
          className="btn btn-warning ml-10 text-xl capitalize"
        >
          Get Devices
        </button>
        <button
          onClick={onClickHandler4}
          className="btn btn-info ml-10 text-xl capitalize"
        >
          Add Data
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
