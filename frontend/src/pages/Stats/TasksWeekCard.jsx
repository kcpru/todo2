import React from "react";
import { Bar } from "react-chartjs-2";
import { MdAssignmentTurnedIn, MdCalendarToday } from "react-icons/md";

import HeaderRow from "@components/HeaderRow";
import "./Stats.scss";

export default function TasksWeekCard({ stats }) {
  return (
    <div className="stats-card">
      <HeaderRow
        icon={<MdAssignmentTurnedIn />}
        title="Tasks This Week"
        subtitle="Your activity by day"
      />
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
            <MdCalendarToday style={{ marginRight: 4, fontSize: "1.1em" }} />
            {stats.streak} days
          </div>
        </div>
      </div>
    </div>
  );
}
