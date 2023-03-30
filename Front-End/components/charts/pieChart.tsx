import { useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

export const Data = [
  {
    id: 1,
    year: 2016,
    userGain: 80000,
  },
  {
    id: 2,
    year: 2017,
    userGain: 45677,
  },
  {
    id: 3,
    year: 2018,
    userGain: 78888,
  },
  {
    id: 4,
    year: 2019,
    userGain: 90000,
  },
  {
    id: 5,
    year: 2020,
    userGain: 4300,
  },
  {
    id: 6,
    year: 2020,
    userGain: 4300,
  },
  {
    id: 7,
    year: 2020,
    userGain: 4300,
  },
  {
    id: 8,
    year: 2020,
    userGain: 4300,
  },
  {
    id: 9,
    year: 2020,
    userGain: 4300,
  },
  {
    id: 10,
    year: 2020,
    userGain: 4300,
  },
  {
    id: 11,
    year: 2020,
    userGain: 4300,
  },
  {
    id: 12,
    year: 2020,
    userGain: 4300,
  },
  {
    id: 13,
    year: 2020,
    userGain: 4300,
  },
  {
    id: 14,
    year: 2020,
    userGain: 4300,
  },
  {
    id: 15,
    year: 2020,
    userGain: 4300,
  },
];

const PieChart = () => {
  ChartJS.register(ArcElement, Tooltip, Legend);

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
