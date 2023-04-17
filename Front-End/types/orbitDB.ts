//Has only the stats
export type Stats = {
  waterflow: string;
  timestamp: string;
};

export type AliasStats = {
  alias: string;
  stats: Stats[];
};

//Has the stats and the deviceID
export type DeviceStats = {
  [deviceID: string]: AliasStats;
};

//Used for OrbitDB
export type DeviceWaterflow = {
  waterflow: string;
  timestamp: string;
  uid: string;
};

export type DeviceData = {
  data: DeviceWaterflow[];
  uid: string;
};
