export type DeviceWaterflow = {
  waterflow: number;
  date: string;
};

export type DeviceData = {
  data: DeviceWaterflow[];
  alias?: string;
};

export type DeviceStats = {
  [deviceID: string]: DeviceData;
};
