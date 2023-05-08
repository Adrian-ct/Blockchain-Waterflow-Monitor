import "../styles/globals.css";
import type { AppProps } from "next/app";
import NavBar from "../components/NavBar";
import { SessionProvider } from "next-auth/react";
import { RecoilRoot } from "recoil";
import Background from "../components/Background";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "../components/AddDeviceModal";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="light"
      />
      <RecoilRoot>
        <SessionProvider session={session}>
          <Modal />
          <Background>
            <NavBar />
            <Component {...pageProps} />
          </Background>
        </SessionProvider>
      </RecoilRoot>
    </>
  );
}

export default MyApp;
