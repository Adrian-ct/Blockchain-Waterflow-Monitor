import { NextPage } from "next";
import LineChart from "../components/charts/lineChart";
import PieChart from "../components/charts/pieChart";
import Card from "../components/Card";
import { BarChart } from "../components/charts/barChart";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { contract } from "../exports/web3";
import axios from "axios";
import { WaterflowDataAddedEvent } from "../types/web3";
import { DeviceStats } from "../types/orbitDB";

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
    if (!devices.length) getDeviceStats();
  }, [session]);

  useEffect(() => {
    const eventSubscription = contract.events
      .WaterFlowDataAdded({ fromBlock: "latest" })
      .on("connected", function () {
        console.log("Connected");
      })
      .on("data", async (event: WaterflowDataAddedEvent) => {
        let CID = event.returnValues[1];
        let deviceID = event.returnValues[0];
        try {
          const response = await axios.get("/api/getLatestWaterflow", {
            params: {
              CID: CID,
            },
          });

          let newDeviceData = { ...devices[deviceID] };
          if (newDeviceData.stats.length > 15) {
            newDeviceData.stats.pop();
            newDeviceData.stats.unshift(response.data.result);
            console.log("popped");
          } else {
            console.log("pushed");
            newDeviceData.stats.push([response.data.result] as any);
          }
          setDevices({
            ...devices,
            [deviceID]: newDeviceData,
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
      <div className="grid grid-cols-5 divide-x-2">
        <Card
          title="Increased water scarcity"
          text="By 2025, it's predicted that approximately two-thirds of the global population could experience water shortages. This is due to the growing demand for water, increased pollution, and climate change, leading to less availability of fresh water sources."
        />
        <Card
          title="Agriculture impacts"
          text="Agriculture accounts for around 70% of global freshwater use. As the global population increases, the demand for food will grow, putting additional pressure on already stressed water resources. This could lead to a decrease in food production, which may result in food shortages and increased food prices."
        />
        <Card
          title="Decline in water quality"
          text="Pollution from industrial and agricultural activities continues to contaminate fresh water sources. If we don't take action to reduce pollution, the quality of available water will decline, leading to increased health risks for humans, as well as negative impacts on ecosystems and biodiversity."
        />
        <Card
          title="Increased conflicts over water resources"
          text="Water scarcity is likely to exacerbate conflicts between countries and regions sharing water resources. As demand for water increases, tensions may rise, leading to political instability and potential conflicts."
        />
        <Card
          title="Economic consequences"
          text="Water scarcity can have significant economic implications, especially in water-intensive industries such as agriculture, energy production, and manufacturing. A lack of access to clean water can hinder economic development, leading to job losses and reduced economic growth."
        />
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
          const data = devices[parseInt(deviceId)].stats.map((data) =>
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

export default Dashboard;
