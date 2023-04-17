import { AliasStats, DeviceWaterflow, Stats } from "../types/orbitDB";

type Props = {
  deviceData: AliasStats;
  deviceID: string;
};

const Item = ({ deviceData, deviceID }: Props) => {
  return (
    <div
      tabIndex={0}
      className="collapse sm:w-6/12 lg:w-2/5 text-white bg-purple-800 collapse-arrow border border-base-300 rounded-box"
    >
      <div className="collapse-title text-xl font-medium text-center">
        {deviceData.alias ? `${deviceData.alias}(${deviceID})` : deviceID}
      </div>
      <div className="collapse-content overflow-scroll ">
        <div className="stats stats-vertical lg:stats-horizontal divide-gray-50 shadow sm:max-h-96">
          {deviceData.stats.length === 0 ? (
            <div className="stat">
              <div className="stat-title">
                No data available for this device.
              </div>
            </div>
          ) : (
            deviceData.stats.map((stat: Stats, idx: number) => {
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

export default Item;
