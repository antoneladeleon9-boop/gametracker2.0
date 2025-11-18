import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function GraficoBarras({ titulo, labels, valores, color }) {
  return (
    <div style={{ width: "100%", maxWidth: "400px", margin: "1rem auto" }}>
      <h4 style={{ textAlign: "center" }}>{titulo}</h4>

      <Bar
        data={{
          labels,
          datasets: [
            {
              label: "Cantidad",
              data: valores,
              backgroundColor: color || "rgba(75, 192, 192, 0.6)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        }}
        options={{
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        }}
      />
    </div>
  );
}
