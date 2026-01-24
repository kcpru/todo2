import { MdAnalytics } from "react-icons/md";

import HeaderRow from "@components/HeaderRow";
import "./Stats.scss";

export default function ActivityCard({ stats }) {
  return (
    <div className="stats-card stats-activity">
      <HeaderRow
        icon={<MdAnalytics />}
        title="Your Activity"
        subtitle="Posts, likes, and comments"
      />
      <div className="stats-activity-list">
        <div className="stats-summary-row">
          <div className="stats-summary-label">Likes given</div>
          <div className="stats-summary-value likes">{stats.likesGiven}</div>
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
          <div className="stats-summary-value">"How to stay productive"</div>
        </div>
        <div className="stats-summary-row">
          <div className="stats-summary-label">Engagement</div>
          <div className="stats-summary-value">Top 5%</div>
        </div>
      </div>
    </div>
  );
}
