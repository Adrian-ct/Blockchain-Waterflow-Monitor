import { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Data } from "./pieChart";
import { Chart as ChartJS, BarElement, Tooltip, Legend } from "chart.js";

export const BarChart = () => {
  ChartJS.register(BarElement);

  const [chartData, setChartData] = useState({
    labels: Data.map((data) => data.year),
    datasets: [
      {
        label: "Users Gained ",
        data: Data.map((data) => data.userGain),
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
        ],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  });

  return (
    <div className="bg-white shadow-sm">
      <div className="chart-container">
        <h2 style={{ textAlign: "center" }}>Water Consumption by Month</h2>
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
