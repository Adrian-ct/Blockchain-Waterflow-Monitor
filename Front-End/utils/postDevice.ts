import axios from "axios";

export type PostDeviceProps = {
  publicKey: string;
  deviceID: string;
};

export const postDevice = async ({ publicKey, deviceID }: PostDeviceProps) => {
  //let publicKey = "123456789";
  //let deviceID = "123456789";
  await axios
    .post(
      "/api/postDevices",
      {
        publicKey,
        deviceID,
        data: {
          waterflow: 20,
          date: new Date().toISOString(),
        },
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
    });
};
