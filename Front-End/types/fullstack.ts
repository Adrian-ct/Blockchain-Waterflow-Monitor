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
