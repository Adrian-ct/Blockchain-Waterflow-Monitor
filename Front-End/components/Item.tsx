import React, { useEffect, useState } from "react";
import { AliasStats, DeviceWaterflow, Stats } from "../types/orbitDB";
import axios from "axios";
import { FiEdit, FiCheck, FiX } from "react-icons/fi";

type Props = {
  deviceData: AliasStats;
  deviceID: string;
};

const Item = ({ deviceData, deviceID }: Props) => {
  const [active, setActive] = useState<boolean>(true);
  const [edit, setEdit] = useState<boolean>(false);
  const [alias, setAlias] = useState<string>("");

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

  const onSaveEdit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (alias.length < 3) {
      alert("Alias must be atleast 3 characters long");
      return;
    }
    if (alias === deviceData?.alias) {
      alert("New Alias must be different!");
      return;
    }
    try {
      const response = await axios.put("/api/updateDevice", {
        uid: deviceID,
        alias,
        active,
      });

      console.log("Update successful:", response.data);
      deviceData.alias = alias;
      setEdit(false);
    } catch (error: any) {
      console.error("Error updating device:", error.response?.data?.error);
    }
  };

  useEffect(() => {
    setActive(deviceData?.active as boolean);
  }, [deviceData]);

  return (
    <div
      tabIndex={0}
      className={`collapse sm:w-6/12 lg:w-2/5 text-white ${
        active ? "glass" : "bg-gray-600"
      } collapse-arrow border-2 border-solid box-border border-black rounded-box`}
    >
      <div className="collapse-title text-xl font-medium text-left">
        <div className="flex justify-between items-center">
          <div className="flex justify-center items-center">
            {edit ? (
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-lg text-white">
                    Enter the new alias
                  </span>
                </label>
                <label className="input-group">
                  <span className="bg-white text-blue-500">#{deviceID}</span>
                  <input
                    type="text"
                    maxLength={20}
                    placeholder={`${deviceData?.alias}`}
                    className="input input-bordered glass text-black placeholder:text-gray-500"
                    onChange={(e) => setAlias(e.target.value)}
                    value={alias}
                  />
                  <button
                    className="btn btn-square border-none bg-green-700"
                    onClick={onSaveEdit}
                  >
                    <FiCheck className="h-6 w-6 text-white" />
                  </button>
                  <button
                    className="btn btn-square border-none bg-red-600"
                    onClick={() => setEdit(false)}
                  >
                    <FiX className="h-6 w-6 text-white" />
                  </button>
                </label>
              </div>
            ) : (
              <>
                {deviceData?.alias
                  ? `${deviceData?.alias} #${deviceID}`
                  : deviceID}
                <button
                  onClick={() => setEdit((prev) => !prev)}
                  className="btn btn-link text-orange-500  ml-2 w-12 p-0"
                >
                  <FiEdit className="h-6 w-6 m-0" />
                </button>
              </>
            )}
          </div>
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
