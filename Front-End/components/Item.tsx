import { DeviceData } from "../types/orbitDB";

type Props = {
  deviceData: DeviceData[];
  deviceID: string;
};

const Item = ({ deviceData, deviceID }: Props) => {
  return (
    <div
      tabIndex={0}
      className="collapse w-2/5 text-white bg-purple-800 collapse-arrow border border-base-300 rounded-box"
    >
      <div className="collapse-title text-xl font-medium text-center">
        {deviceID}
      </div>
      <div className="collapse-content flex overflow-y-scroll">
        <div className="stats stats-vertical lg:stats-horizontal shadow">
          {deviceData.length === 0 ? (
            <div className="stat">
              <div className="stat-title">
                No data available for this device.
              </div>
            </div>
          ) : (
            deviceData.map((stat: DeviceData, idx: number) => {
              return (
                <div className="stat" key={idx as number}>
                  <div className="stat-title">Stats for device {stat.date}</div>
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

export default Item;
