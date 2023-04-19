import axios from "axios";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import { DeviceStats } from "../types/orbitDB";
import AlertBox from "../components/AlertBox";
import { useRecoilState } from "recoil";
import { alertBoxAtom } from "../atoms/atom";
import Tab1 from "../components/profileTabs/Tab1";

const Profile: NextPage = () => {
  const [devices, setDevices] = useState<DeviceStats>({});

  const { data: session } = useSession();
  const [alertBox, setAlertBox] = useRecoilState(alertBoxAtom);
  const [activeTab, setActiveTab] = useState<number>(1);

  const getDeviceStats = async () => {
    let email = session?.user?.email as string;
    if (!email) return;
    axios
      .get("/api/getDeviceStats", { params: { email, limit: -1 } })
      .then(function (response) {
        console.log(response.data.result);
        setDevices(response.data.result);
      })
      .catch(function (error) {
        console.log(error.response?.data?.error);
      });
  };

  useEffect(() => {
    if (!Object.keys(devices).length) getDeviceStats();
  }, [session]);

  return (
    <div className="flex flex-col gap-6 justify-center items-center w-full">
      <Modal email={session?.user?.email as string} />
      {alertBox.show && (
        <div className="fixed w-2/5 left-1/2 -translate-x-1/2 bottom-10">
          <AlertBox message={alertBox.message} error={alertBox.error} />{" "}
        </div>
      )}
      <div className="tabs tabs-boxed">
        <div
          id="_tab1"
          className={`tab ${activeTab === 1 && "tab-active"}`}
          onClick={() => setActiveTab(1)}
        >
          Tab 1
        </div>
        <div
          id="_tab2"
          className={`tab ${activeTab === 2 && "tab-active"}`}
          onClick={() => setActiveTab(2)}
        >
          Tab 2
        </div>
        <div
          id="_tab3"
          className={`tab ${activeTab === 3 && "tab-active"}`}
          onClick={() => setActiveTab(3)}
        >
          Tab 3
        </div>
      </div>
      {activeTab === 1 && <Tab1 devices={devices} />}
    </div>
  );
};

export default Profile;
