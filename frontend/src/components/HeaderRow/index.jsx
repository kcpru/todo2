import "./HeaderRow.scss";

export default function HeaderRow({
  icon,
  title,
  subtitle,
  className = "",
  ...props
}) {
  return (
    <div className={`header-row ${className}`.trim()} {...props}>
      {icon && <span className="header-row-icon">{icon}</span>}
      <div>
        {title && <h3 className="header-row-title">{title}</h3>}
        {subtitle && <div className="header-row-subtitle">{subtitle}</div>}
      </div>
    </div>
  );
}
