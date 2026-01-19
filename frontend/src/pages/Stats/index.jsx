import { useState } from "react";
import TasksWeekCard from "./TasksWeekCard";
import ActivityCard from "./ActivityCard";
import ProductivityCard from "./ProductivityCard";
import "./Stats.scss";

export default function Stats() {
  const [stats] = useState({
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

  return (
    <div className="stats-page">
      <div className="stats-cards">
        <TasksWeekCard stats={stats} />
        <ActivityCard stats={stats} />
        <ProductivityCard stats={stats} />
      </div>
    </div>
  );
}
