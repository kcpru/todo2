import "./chartjs-setup";
import { Line } from "react-chartjs-2";
import { MdTimeline } from "react-icons/md";
import HeaderRow from "@components/HeaderRow";
import "./Stats.scss";

export default function ProductivityCard({ stats }) {
  return (
    <div className="stats-card stats-productivity">
      <HeaderRow
        icon={<MdTimeline />}
        title="Productivity by Hour"
        subtitle="When you get the most done"
      />
      <Line
        data={{
          labels: stats.hourlyLabels,
          datasets: [
            {
              label: "Tasks completed per hour",
              data: stats.hourlyData,
              fill: false,
              borderColor: "#4d96ff",
              backgroundColor: "#4d96ff",
              tension: 0.35,
              pointRadius: 4,
              pointHoverRadius: 6,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: { display: false },
            title: { display: false },
          },
          scales: {
            y: { beginAtZero: true, ticks: { stepSize: 1 } },
          },
        }}
        height={180}
      />
    </div>
  );
}
