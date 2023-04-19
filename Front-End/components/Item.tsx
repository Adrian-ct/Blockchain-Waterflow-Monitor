import React, { useEffect, useState } from "react";
import { AliasStats, DeviceWaterflow, Stats } from "../types/orbitDB";
import axios from "axios";

type Props = {
  deviceData: AliasStats;
  deviceID: string;
};

const Item = ({ deviceData, deviceID }: Props) => {
  const [active, setActive] = useState<boolean>(true);

  const handleToggleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setActive((prev) => !prev);
    try {
      let alias = deviceData?.alias;
      let active = e.target.checked;

      const response = await axios.put("/api/updateDevice", {
        uid: deviceID,
        alias,
        active,
      });

      console.log("Update successful:", response.data);
    } catch (error: any) {
      console.error("Error updating device:", error.response?.data?.error);
      setActive((prev) => !prev);
    }
  };

  useEffect(() => {
    setActive(deviceData?.active as boolean);
  }, [deviceData]);

  return (
    <div
      tabIndex={0}
      className={`collapse sm:w-6/12 lg:w-2/5 text-white ${
        active ? "bg-purple-800" : "bg-gray-600"
      } collapse-arrow border border-base-300 rounded-box`}
    >
      <div className="collapse-title text-xl font-medium text-left">
        <div className="flex justify-between items-center">
          {deviceData?.alias ? `${deviceData?.alias} #${deviceID}` : deviceID}
          <input
            type="checkbox"
            className="toggle toggle-success"
            checked={active}
            onChange={handleToggleChange}
          />
        </div>
      </div>
      <div className="collapse-content overflow-scroll ">
        <div className="stats stats-vertical lg:stats-horizontal divide-gray-50 shadow sm:max-h-96">
          {deviceData?.stats.length === 0 ? (
            <div className="stat">
              <div className="stat-title">
                No data available for this device.
              </div>
            </div>
          ) : (
            deviceData?.stats.map((stat: Stats, idx: number) => {
              return (
                <div className="stat" key={idx as number}>
                  <div className="stat-title">
                    Stats for {new Date(stat.timestamp).toLocaleString()}
                  </div>
                  <div className="stat-value">{stat.waterflow}</div>
                  <div className="stat-desc">↗︎ 400 (22%)</div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(Item);
