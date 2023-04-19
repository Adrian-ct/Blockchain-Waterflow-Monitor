import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";

type Props = {
  width: number;
  height: number;
  room: string;
  labels: string[];
  data: number[];
};

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);
const LineChart = ({ width, height, room, labels, data }: Props) => {
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Water Consumption (L)",
        data: data,
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
  };

  return (
    <div className="bg-white border-dashboard">
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
