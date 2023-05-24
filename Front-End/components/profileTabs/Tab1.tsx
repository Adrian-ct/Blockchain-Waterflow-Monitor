import { useEffect, useState } from "react";
import { AliasStats, DeviceStats } from "../../types/orbitDB";
import Item from "../Item";
import EmptyPlaceholder from "../EmptyPlaceholder";

type Props = {
  devices: DeviceStats;
};
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
const Tab1 = ({ devices }: Props) => {
  const [filteredDevices, setFilteredDevices] = useState<DeviceStats>({});

  useEffect(() => {
    if (Object.keys(filteredDevices).length === 0) setFilteredDevices(devices);
  }, [devices]);

  //Filters and Sorts
  const [filter, setFilter] = useState("None");
  const [sort, setSort] = useState("None");

  useEffect(() => {
    if (filter !== "None") {
      const filteredDevices = filterFunctions[
        filter as keyof typeof filterFunctions
      ](devices) as DeviceStats;
      setFilteredDevices(filteredDevices);
    } else {
      setFilteredDevices(devices);
    }
  }, [filter]);

  useEffect(() => {
    if (sort !== "None") {
      const sortedDevices = sortFunctions[sort as keyof typeof sortFunctions](
        devices
      ) as DeviceStats;
      setFilteredDevices(sortedDevices);
    } else {
      setFilteredDevices(devices);
    }
  }, [sort]);

  return (
    <>
      <div className="flex justify-between sm:w-6/12 lg:w-2/5">
        <div className="dropdown dropdown-left">
          <label
            tabIndex={0}
            className="btn m-1 btn-warning hover:btn-success hover:text-white transition-colors duration-300 "
          >
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
          <label
            tabIndex={0}
            className="btn m-1 btn-warning hover:btn-success hover:text-white transition-colors duration-300"
          >
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
      {Object.keys(filteredDevices).length ? (
        Object.keys(filteredDevices).map((deviceId: string, idx) => {
          return (
            <Item
              deviceID={deviceId}
              deviceData={filteredDevices[parseInt(deviceId)] as AliasStats}
              key={idx as number}
            />
          );
        })
      ) : (
        <EmptyPlaceholder text="Looks like you didn't add any devices yet :(" />
      )}
    </>
  );
};

export default Tab1;
