import { MdAnalytics } from "react-icons/md";
import "./Stats.scss";

export default function ActivityCard({ stats }) {
  return (
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
