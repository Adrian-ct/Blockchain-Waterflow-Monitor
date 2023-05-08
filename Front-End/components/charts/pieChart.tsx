import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { RecurrentStats } from "../../pages/api/getMonthlyStats";
import axios from "axios";

type Props = {
  email: string;
};

const PieChart = ({ email }: Props) => {
  ChartJS.register(ArcElement, Tooltip, Legend);

  const [monthlyStats, setMonthlyStats] = useState<RecurrentStats[]>([]);

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Liters of water consumed ",
        data: [],
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#00ccff",
          "#00775f",
          "#f3ba2f",
          "#2a71d0",
        ],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  });

  async function getMonthlyStats() {
    try {
      const response = await axios.get("/api/getMonthlyStats", {
        params: { email },
      });
      console.log(response.data.result);
      setMonthlyStats(response.data.result);
    } catch (error: any) {
      console.log(error.response?.data?.error);
    }
  }

  useEffect(() => {
    if (!monthlyStats || monthlyStats.length === 0) {
      getMonthlyStats();
    }
  }, [email]);

  useEffect(() => {
    if (!monthlyStats) return;
    const labels = monthlyStats.map((obj) => Object.keys(obj)[0]);
    const waterflow = monthlyStats.map((obj) => Object.values(obj)[0]);

    setChartData({
      labels: labels as never[],
      datasets: [
        {
          label: "Liters of water consumed ",
          data: waterflow as never[],
          backgroundColor: [
            "#2c7db7",
            "#00ccff",
            "#1445ae",
            "#00ff9d",
            "#00ff73",
          ],
          borderColor: "black",
          borderWidth: 2,
        },
      ],
    });
  }, [monthlyStats]);

  return (
    <div className="bg-white shadow-sm border-dashboard">
      <div className="chart-container">
        <h2 style={{ textAlign: "center" }}>Water Consumption by Day</h2>
        <Pie
          data={chartData}
          width={500}
          height={500}
          options={{
            maintainAspectRatio: true,
          }}
        />{" "}
      </div>
    </div>
  );
};

export default PieChart;
