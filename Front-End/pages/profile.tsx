import axios from "axios";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import { AliasStats, DeviceStats } from "../types/orbitDB";
import AlertBox from "../components/AlertBox";
import { useRecoilState } from "recoil";
import { alertBoxAtom } from "../atoms/atom";
import Item from "../components/Item";

const filterFunctions = {
  None: (data: DeviceStats) => data,
  Hour: (data: DeviceStats) => {
    const newData: DeviceStats = {};
    Object.keys(data).forEach((deviceID) => {
      let stats = data[deviceID].stats;
      let currentHour = new Date();
      let filteredStats = stats.filter((stat) => {
        let date = new Date(stat.timestamp);
        return (
          date.getFullYear() === currentHour.getFullYear() &&
          date.getMonth() === currentHour.getMonth() &&
          date.getDate() === currentHour.getDate() &&
          date.getHours() === currentHour.getHours()
        );
      });
      newData[deviceID] = { ...data[deviceID], stats: filteredStats };
    });
    return newData;
  },
  Day: (data: DeviceStats) => {
    const newData: DeviceStats = {};
    Object.keys(data).forEach((deviceID) => {
      let stats = data[deviceID].stats;
      let currentHour = new Date();
      let filteredStats = stats.filter((stat) => {
        let date = new Date(stat.timestamp);
        return (
          date.getFullYear() === currentHour.getFullYear() &&
          date.getMonth() === currentHour.getMonth() &&
          date.getDate() === currentHour.getDate()
        );
      });
      newData[deviceID] = { ...data[deviceID], stats: filteredStats };
    });
    return newData;
  },
  Week: (data: DeviceStats) => {
    const newData: DeviceStats = {};
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    Object.keys(data).forEach((deviceID) => {
      let stats = data[deviceID].stats;
      let filteredStats = stats.filter((stat) => {
        let date = new Date(stat.timestamp);
        return date >= oneWeekAgo;
      });
      newData[deviceID] = { ...data[deviceID], stats: filteredStats };
    });
    return newData;
  },
  Month: (data: DeviceStats) => {
    const newData: DeviceStats = {};

    Object.keys(data).forEach((deviceID) => {
      let stats = data[deviceID].stats;
      let currentHour = new Date();
      let filteredStats = stats.filter((stat) => {
        let date = new Date(stat.timestamp);
        return (
          date.getFullYear() === currentHour.getFullYear() &&
          date.getMonth() === currentHour.getMonth()
        );
      });
      newData[deviceID] = { ...data[deviceID], stats: filteredStats };
    });
    return newData;
  },
};

const sortFunctions = {
  None: (data: DeviceStats) => data,
  "Most Recent": (data: DeviceStats) => {
    const newData: DeviceStats = {};
    Object.keys(data).forEach((deviceID) => {
      let stats = data[deviceID].stats;
      let sortedStats = stats.sort((a, b) => {
        let dateA = new Date(a.timestamp);
        let dateB = new Date(b.timestamp);
        return dateB.getTime() - dateA.getTime();
      });
      newData[deviceID] = { ...data[deviceID], stats: sortedStats };
    });
    return newData;
  },
  "Least Recent": (data: DeviceStats) => {
    const newData: DeviceStats = {};
    Object.keys(data).forEach((deviceID) => {
      let stats = data[deviceID].stats;
      let sortedStats = stats.sort((a, b) => {
        let dateA = new Date(a.timestamp);
        let dateB = new Date(b.timestamp);
        return dateA.getTime() - dateB.getTime();
      });
      newData[deviceID] = { ...data[deviceID], stats: sortedStats };
    });
    return newData;
  },
};
const Profile: NextPage = () => {
  const [devices, setDevices] = useState<DeviceStats>({});
  const [unfilteredDevices, setUnfilteredDevices] = useState<DeviceStats>({});

  const { data: session } = useSession();
  const [alertBox, setAlertBox] = useRecoilState(alertBoxAtom);
  const [activeTab, setActiveTab] = useState<number>(1);

  //Filters and Sorts
  const [filter, setFilter] = useState("None");
  const [sort, setSort] = useState("None");

  const getDeviceStats = async () => {
    let email = session?.user?.email as string;
    if (!email) return;
    axios
      .get("/api/getDeviceStats", { params: { email, limit: -1 } })
      .then(function (response) {
        console.log(response.data.result);
        setDevices(response.data.result);
        setUnfilteredDevices(response.data.result);
      })
      .catch(function (error) {
        console.log(error.response?.data?.error);
      });
  };

  useEffect(() => {
    if (filter !== "None") {
      const filteredDevices = filterFunctions[
        filter as keyof typeof filterFunctions
      ](unfilteredDevices) as DeviceStats;
      setDevices(filteredDevices);
    } else {
      setDevices(unfilteredDevices);
    }
  }, [filter]);

  useEffect(() => {
    if (sort !== "None") {
      const sortedDevices = sortFunctions[sort as keyof typeof sortFunctions](
        unfilteredDevices
      ) as DeviceStats;
      setDevices(sortedDevices);
    } else {
      setDevices(unfilteredDevices);
    }
  }, [sort]);

  useEffect(() => {
    if (!unfilteredDevices.length) getDeviceStats();
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
      {activeTab === 1 && (
        <>
          <div className="flex justify-between sm:w-6/12 lg:w-2/5">
            <div className="dropdown dropdown-left">
              <label tabIndex={0} className="btn m-1 btn-warning">
                Filters
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 shadow bg-white text-blue-600 text-lg rounded-box w-52"
              >
                <li
                  className={`${filter === "None" && "selected"}`}
                  onClick={() => setFilter("None")}
                >
                  <a>None</a>
                </li>
                <li
                  className={`${filter === "Hour" && "selected"}`}
                  onClick={() => setFilter("Hour")}
                >
                  <a>By Hour</a>
                </li>
                <li
                  className={`${filter === "Day" && "selected"}`}
                  onClick={() => setFilter("Day")}
                >
                  <a>By Day</a>
                </li>
                <li
                  className={`${filter === "Week" && "selected"}`}
                  onClick={() => setFilter("Week")}
                >
                  <a>Last 7 Days</a>
                </li>
                <li
                  className={`${filter === "Month" && "selected"}`}
                  onClick={() => setFilter("Month")}
                >
                  <a>Current Month</a>
                </li>
              </ul>
            </div>
            <div className="dropdown dropdown-right">
              <label tabIndex={0} className="btn m-1 btn-warning">
                Sort
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 shadow bg-white text-blue-600 text-lg rounded-box w-52"
              >
                <li
                  className={`${sort === "Most Recent" && "selected"}`}
                  onClick={() => setSort("Most Recent")}
                >
                  <a>Most Recent</a>
                </li>
                <li
                  className={`${sort === "Least Recent" && "selected"}`}
                  onClick={() => setSort("Least Recent")}
                >
                  <a>Least Recent</a>
                </li>
              </ul>
            </div>
          </div>
          {Object.keys(devices).map((deviceId: string, idx) => {
            return (
              <Item
                deviceID={deviceId}
                deviceData={devices[parseInt(deviceId)] as AliasStats}
                key={idx as number}
              />
            );
          })}
        </>
      )}
    </div>
  );
};

export default Profile;
