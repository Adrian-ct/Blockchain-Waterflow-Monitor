export interface ResponseData {
  error?: string;
  msg?: string;
}

export type contact = {
  name: string;
  email: string;
  phoneNumber: string;
  avatar: string;
};

export type RecurrentStats = {
  [key: string]: number;
};

export interface BlockchainKeys {
  publicKey: string;
  privateKey: string;
}

export interface BlockchainKeysModal extends BlockchainKeys {
  show: boolean;
}

export interface BlockchainKeysWithResponse extends BlockchainKeys {
  message?: string;
  error?: string;
}
