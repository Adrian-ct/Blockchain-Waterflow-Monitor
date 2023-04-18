export type WaterflowDataAddedEvent = {
  event: string;
  signature: string | null;
  address: string;
  returnValues: string[];
  logIndex: number;
  transactionIndex: number;
  transactionHash: string;
  blockHash: string;
  blockNumber: number;
  raw: {
    data: string;
    topics: string[];
  };
};
