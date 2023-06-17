import { NextPage } from "next";
import LineChart from "../components/charts/lineChart";
import PieChart from "../components/charts/pieChart";
import { BarChart } from "../components/charts/barChart";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { contract } from "../exports/web3";
import axios from "axios";
import { WaterflowDataAddedEvent } from "../types/web3";
import { DeviceStats } from "../types/orbitDB";
import withAuth from "../components/withAuth";


const Dashboard: NextPage = () => {
  const [devices, setDevices] = useState<DeviceStats>({});
  const { data: session } = useSession();

  const getDeviceStats = async () => {
    let email = session?.user?.email as string;
    if (!email) return;
    axios
      .get("/api/getDeviceStats", { params: { email, limit: 15 } })
      .then(function (response) {
        setDevices(response.data.result);
      })
      .catch(function (error) {
        console.log(error.response?.data?.error);
      });
  };

  useEffect(() => {
    if (!Object.keys(devices).length) getDeviceStats();
  }, [session]);

  useEffect(() => {
    const eventSubscription = contract.events
      .WaterFlowDataAdded({ fromBlock: "latest" })
      .on("connected", function () {
        console.log("Connected");
      })
      .on("data", async (event: WaterflowDataAddedEvent) => {
        let deviceID = event.returnValues[0];
        let CID = event.returnValues[1];

        try {
          const response = await axios.get("/api/getLatestWaterflow", {
            params: {
              CID: CID,
            },
          });

          setDevices((prevDevices) => {
            let newDeviceData = { ...prevDevices[deviceID] };

            if (newDeviceData.stats.length >= 15) {
              newDeviceData.stats.pop();
            }

            // Check if the new value is already in the array
            const isNewValueInArray = newDeviceData.stats.some(
              (stat) => stat.timestamp === response.data.result.timestamp
            );

            // If the new value is not in the array, add it to the beginning
            if (!isNewValueInArray) {
              return {
                ...prevDevices,
                [deviceID]: {
                  ...newDeviceData,
                  stats: [response.data.result, ...newDeviceData.stats],
                },
              };
            } else {
              return prevDevices;
            }
          });
        } catch (error) {
          console.error("Error fetching latest waterflow data:", error);
        }
      })
      .on("error", (error: WaterflowDataAddedEvent) => {
        console.error("Error in WaterflowDataAdded event subscription:", error);
      });

    // Clean up the event subscription when the component is unmounted
    return () => {
      eventSubscription.unsubscribe();
    };
  }, []);

  return (
    <div className="w-[85%] mt-5 lg:p-10 m-auto flex flex-col gap-4 items-center justify-center glass">
      <div className="flex justify-center items-center gap-5">
        <PieChart email={session?.user?.email as string} />
        <BarChart email={session?.user?.email as string} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {Object.keys(devices).map((deviceId: string, idx) => {
          const labels = devices[parseInt(deviceId)].stats.map((data) => {
            const date = new Date(data.timestamp);
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const seconds = date.getSeconds();

            return `${hours.toString().padStart(2, "0")}:${minutes
              .toString()
              .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
          });
          const data = devices[+deviceId].stats.map((data) =>
            parseFloat(data.waterflow)
          );
          labels.reverse();
          data.reverse();

          return (
            <div key={idx}>
              <LineChart
                room={devices[parseInt(deviceId)].alias}
                width={600}
                height={300}
                labels={labels}
                data={data}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default withAuth(Dashboard);
