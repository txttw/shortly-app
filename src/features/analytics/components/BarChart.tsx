import {
  Chart,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";
Chart.register(CategoryScale, LinearScale, Tooltip, Legend, BarElement);

export default function BarChart({
  label,
  labels,
  data,
}: {
  label: string;
  labels: (number | string)[];
  data: number[];
}) {
  const d = {
    labels: labels,
    datasets: [
      {
        label,
        data,
        backgroundColor: Array(labels.length).fill("#1565C0"),
        borderColor: Array(labels.length).fill("#0D47A1"),
        borderWidth: 1,
      },
    ],
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              stepSize: 1,
            },
          },
        ],
      },
    },
  };

  return <Bar data={d} />;
}
