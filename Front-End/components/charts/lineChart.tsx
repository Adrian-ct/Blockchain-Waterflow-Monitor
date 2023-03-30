import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import { useState, useEffect } from "react";

type Props = {
  width: number;
  height: number;
  room: string;
};

const LineChart = ({ width, height, room }: Props) => {
  ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement
  );

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Water Consumption",
        data: [],
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
          "yellow",
          "red",
        ],
        borderColor: "#40E0D0",
        borderWidth: 2,
        pointRadius: 5,
      },
    ],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const newChartData = { ...chartData };
      if (newChartData.labels.length > 15) {
        newChartData.labels.shift();
        newChartData.datasets[0].data.shift();
        newChartData.labels.push("");
        newChartData.datasets[0].data.push(
          Math.floor(Math.random() * 100) as never
        );
      } else {
        newChartData.labels.push("");
        newChartData.datasets[0].data.push(
          Math.floor(Math.random() * 100) as never
        );
      }
      setChartData(newChartData);
    }, 1000);

    return () => clearInterval(interval);
  }, [chartData]);

  return (
    <div className="bg-white">
      <h2 className="text-center font-bold text-blue-500">{room}</h2>
      <Line
        data={chartData}
        width={width}
        height={height}
        options={{
          plugins: {
            legend: {
              display: false,
            },
          },
          maintainAspectRatio: true,
          line: {
            datasets: {
              fill: true,
              tension: 0.5,
            },
          },
          animation: {
            duration: 1500,
            easing: "easeInOutSine",
          },
        }}
      />
    </div>
  );
};

export default LineChart;