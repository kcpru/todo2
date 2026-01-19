import "./chartjs-setup";
import { Line } from "react-chartjs-2";
import { MdTimeline } from "react-icons/md";
import "./Stats.scss";

export default function ProductivityCard({ stats }) {
  return (
    <div className="stats-card stats-productivity">
      <div className="stats-card-header">
        <MdTimeline className="stats-card-icon" />
        <div>
          <div className="stats-card-title">Productivity by Hour</div>
          <div className="stats-card-desc">When you get the most done</div>
        </div>
      </div>
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
