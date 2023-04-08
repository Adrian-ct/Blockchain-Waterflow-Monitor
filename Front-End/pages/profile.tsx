import axios from "axios";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import { DeviceStats } from "../types/orbitDB";
import AlertBox from "../components/AlertBox";
import { useRecoilState } from "recoil";
import { alertBoxAtom } from "../atoms/atom";
import Item from "../components/Item";

const Profile: NextPage = () => {
  const [devices, setDevices] = useState<DeviceStats>({});
  const { data: session } = useSession();
  const [alertBox, setAlertBox] = useRecoilState(alertBoxAtom);

  const onClickHandler2 = async () => {
    let email = session?.user?.email as string;
    if (!email) return;
    axios
      .get("/api/getDeviceStats", { params: { email } })
      .then(function (response) {
        console.log(response.data.result);
        setDevices(response.data.result);
      })
      .catch(function (error) {
        console.log(error.response?.data?.error);
      });
  };

  useEffect(() => {
    if (!devices.length) onClickHandler2();
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
      {Object.keys(devices).map((deviceId: string, idx) => {
        return (
          <Item
            deviceID={deviceId}
            deviceData={devices[deviceId]}
            key={idx as number}
          />
        );
      })}
    </div>
  );
};

export default Profile;
