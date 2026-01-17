export function Badge({ count, label, variant = "primary", size = "md" }) {
  return (
    <span className={`badge badge-${variant} badge-${size}`}>
      {label || count}
    </span>
  );
}
