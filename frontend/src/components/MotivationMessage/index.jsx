import "./MotivationMessage.scss";

export default function MotivationMessage({ message }) {
  if (!message) return null;
  return (
    <div className="motivation-message">
      <span role="img" aria-label="Motivation">
        💡
      </span>{" "}
      {message}
    </div>
  );
}
