import axios from "axios";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { DeviceStats } from "../types/orbitDB";
import Tab1 from "../components/profileTabs/Tab1";
import withAuth from "../components/withAuth";
import Tab2 from "../components/profileTabs/Tab2";

const Profile: NextPage = () => {
  const [devices, setDevices] = useState<DeviceStats>({});

  const { data: session } = useSession();
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
      <div className="tabs tabs-boxed">
        <div
          id="_tab1"
          className={`tab ${activeTab === 1 && "tab-active"}`}
          onClick={() => setActiveTab(1)}
        >
          {`Devices (${Object.keys(devices).length})`}
        </div>
        <div
          id="_tab2"
          className={`tab ${activeTab === 2 && "tab-active"}`}
          onClick={() => setActiveTab(2)}
        >
          Contacts
        </div>
      </div>
      {activeTab === 1 ? (
        <Tab1 devices={devices} />
      ) : activeTab === 2 ? (
        <Tab2 />
      ) : (
        <div>Tab 3</div>
      )}
    </div>
  );
};

export default withAuth(Profile);
