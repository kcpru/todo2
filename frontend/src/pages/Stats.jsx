import { useEffect, useState } from "react";
import {
  MdAssignmentTurnedIn,
  MdAnalytics,
  MdCalendarToday,
  MdTimeline,
} from "react-icons/md";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import "./Stats.scss";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
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
    likesGiven: 123,
    commentsAdded: 56,
    shares: 12,
    weekData: [5, 7, 6, 8, 4, 9, 3],
    weekLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    hourlyLabels: [
      "6am",
      "7am",
      "8am",
      "9am",
      "10am",
      "11am",
      "12pm",
      "1pm",
      "2pm",
      "3pm",
      "4pm",
      "5pm",
      "6pm",
      "7pm",
      "8pm",
      "9pm",
    ],
    hourlyData: [0, 1, 2, 3, 4, 5, 4, 3, 2, 2, 3, 4, 5, 3, 2, 1],
  });

  // Example: fetch stats from backend
  // useEffect(() => {
  //   fetch("/api/stats").then(...)
  // }, []);

  return (
    <div className="stats-page">
      <div className="stats-cards">
        <div className="stats-card">
          <div className="stats-card-header">
            <MdAssignmentTurnedIn className="stats-card-icon" />
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
          <div className="stats-summary-modern">
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
                <MdCalendarToday
                  style={{ marginRight: 4, fontSize: "1.1em" }}
                />
                {stats.streak} days
              </div>
            </div>
          </div>
        </div>
        <div className="stats-card stats-activity">
          <div className="stats-card-header">
            <MdAnalytics className="stats-card-icon" />
            <div>
              <div className="stats-card-title">Your Activity</div>
              <div className="stats-card-desc">Posts, likes, and comments</div>
            </div>
          </div>
          <div className="stats-activity-list">
            <div className="stats-summary-row">
              <div className="stats-summary-label">Likes given</div>
              <div className="stats-summary-value likes">
                {stats.likesGiven}
              </div>
            </div>
            <div className="stats-summary-row">
              <div className="stats-summary-label">Comments added</div>
              <div className="stats-summary-value comments">
                {stats.commentsAdded}
              </div>
            </div>
            <div className="stats-summary-row">
              <div className="stats-summary-label">Posts shared</div>
              <div className="stats-summary-value shares">{stats.shares}</div>
            </div>
            <div className="stats-summary-row">
              <div className="stats-summary-label">Most active day</div>
              <div className="stats-summary-value">Saturday</div>
            </div>
            <div className="stats-summary-row">
              <div className="stats-summary-label">Most liked post</div>
              <div className="stats-summary-value">
                "How to stay productive"
              </div>
            </div>
            <div className="stats-summary-row">
              <div className="stats-summary-label">Engagement</div>
              <div className="stats-summary-value">Top 5%</div>
            </div>
          </div>
        </div>
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
      </div>
    </div>
  );
}
