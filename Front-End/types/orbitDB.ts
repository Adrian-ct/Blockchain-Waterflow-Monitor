export type EntryData = {
  deviceID: string;
  data: {
    waterflow: number;
    date: string;
  };
};

// export type Device

// export interface DeviceData {
//   deviceID: string;
//   data: EntryData[];
// }

export type DeviceData = {
  waterflow: number;
  date: string;
};

export type DeviceStats = { [deviceID: string]: DeviceData[] };

export interface DatabaseEntry {
  hash: string;
  id: string;
  payload: {
    op: string;
    key: string;
    value: EntryData;
  };
  identity: {
    id: string;
    publicKey: string;
  };
}
