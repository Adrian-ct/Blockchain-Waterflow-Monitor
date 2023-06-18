import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, Tooltip, Legend } from "chart.js";
import { RecurrentStats } from "../../types/fullstack";
import axios from "axios";

type Props = {
  email: string;
};

function getPreviousHourAMPM() {
  const date = new Date();
  //date.setHours(date.getHours() - 1);
  const hour = date.getHours();
  const ampm = date.getHours() < 12 ? "AM" : "PM";
  return `${hour} ${ampm}`;
}

export const BarChart = ({ email }: Props) => {
  ChartJS.register(BarElement);

  const [dailyStats, setDailyStats] = useState<RecurrentStats[]>([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Liters of water consumed ",
        data: [],
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#00ccff",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
        ],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  });

  async function getDailyStats() {
    try {
      const response = await axios.get("/api/getDailyStats");
      console.log(response.data.result);
      setDailyStats(response.data.result);
    } catch (error: any) {
      console.log(error.response?.data?.error);
    }
  }

  useEffect(() => {
    if (!dailyStats || dailyStats.length === 0) {
      getDailyStats();
    }
  }, [email]);

  useEffect(() => {
    if (!dailyStats) return;
    const labels = dailyStats.map((obj) => Object.keys(obj)[0]);
    const waterflow = dailyStats.map((obj) => Object.values(obj)[0]);

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
  }, [dailyStats]);

  return (
    <div className="bg-white shadow-sm border-dashboard">
      <div className="chart-container">
        <h2 style={{ textAlign: "center" }}>
          Water Consumption at {getPreviousHourAMPM()}
        </h2>
        <Bar
          data={chartData}
          width={600}
          height={500}
          options={{
            plugins: {
              title: {
                display: true,
                text: "Users Gained between 2016-2020",
              },
              legend: {
                display: true,
              },
            },
            maintainAspectRatio: true,
          }}
        />
      </div>
    </div>
  );
};
