import axios from "axios";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Modal from "../components/Modal";

type DeviceType = {
  publicKey: string;
  deviceID: string;
  data: {
    waterflow: number;
    date: Date;
  };
};

const Item = ({ device, key }: { device: DeviceType; key: number }) => {
  return (
    <div
      tabIndex={0}
      className="collapse text-white bg-purple-800 collapse-arrow border border-base-300 rounded-box"
    >
      <div className="collapse-title text-xl font-medium">
        {device.publicKey}
      </div>
      <div className="collapse-content">
        A diagram for each device will be displayed here.
      </div>
    </div>
  );
};

const Profile: NextPage = () => {
  const [devices, setDevices] = useState<DeviceType[]>([]);
  const { data: session } = useSession();

  const onClickHandler2 = async () => {
    //get request to get all devices
    let publicKey = "123456789";
    axios
      .get("/api/getDevices", { params: { publicKey } })
      .then(function (response) {
        setDevices(response.data.msg);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useState(() => {
    if (!devices.length) onClickHandler2();
  }, []);

  return (
    <div className="flex flex-col gap-6 justify-center items-center w-full">
      <Modal email={session?.user?.email ?? ""} />
      <div className="tabs tabs-boxed">
        <div id="_tab1" className="tab tab-active">
          Tab 1
        </div>
        <div id="_tab2" className="tab">
          Tab 2
        </div>
        <div id="_tab3" className="tab">
          Tab 3
        </div>
      </div>
      {devices.map((device: DeviceType, idx: number) => {
        return <Item device={device} key={idx as number} />;
      })}
    </div>
  );
};

export default Profile;
