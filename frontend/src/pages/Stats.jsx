import { useEffect, useState } from "react";
import { MdLeaderboard, MdBarChart, MdCalendarToday } from "react-icons/md";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import "./Stats.scss";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Stats() {
  // Example data, replace with real API calls
  const [stats, setStats] = useState({
    totalTodos: 42,
    completedTodos: 30,
    streak: 7,
    weekData: [5, 7, 6, 8, 4, 9, 3],
    weekLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  });

  // Example: fetch stats from backend
  // useEffect(() => {
  //   fetch("/api/stats").then(...)
  // }, []);

  return (
    <div className="stats-page">
      <h2 className="stats-header">
        <MdLeaderboard className="stats-header-icon" /> Statistics
      </h2>
      <div className="stats-cards">
        <div className="stats-card">
          <div className="stats-card-header">
            <MdBarChart className="stats-card-icon" />
            <div>
              <div className="stats-card-title">Tasks This Week</div>
              <div className="stats-card-desc">Your activity by day</div>
            </div>
          </div>
          <Bar
            data={{
              labels: stats.weekLabels,
              datasets: [
                {
                  label: "Tasks completed",
                  data: stats.weekData,
                  backgroundColor: "rgba(77,150,255,0.7)",
                  borderRadius: 8,
                  maxBarThickness: 32,
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
            height={220}
          />
        </div>
        <div className="stats-card stats-summary">
          <div className="stats-summary-row">
            <div className="stats-summary-label">Total tasks</div>
            <div className="stats-summary-value">{stats.totalTodos}</div>
          </div>
          <div className="stats-summary-row">
            <div className="stats-summary-label">Completed</div>
            <div className="stats-summary-value completed">
              {stats.completedTodos}
            </div>
          </div>
          <div className="stats-summary-row">
            <div className="stats-summary-label">Current streak</div>
            <div className="stats-summary-value streak">
              <MdCalendarToday style={{ marginRight: 4, fontSize: "1.1em" }} />
              {stats.streak} days
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
