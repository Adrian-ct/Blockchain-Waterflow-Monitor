//Has only the stats
export type Stats = {
  waterflow: string;
  timestamp: string;
};

export type AliasStats = {
  alias: string;
  stats: Stats[];
  active?: boolean;
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
