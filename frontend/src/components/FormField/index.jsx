import { Input } from "../Input";

export function FormField({
  value,
  onChange,
  placeholder,
  isTextarea = false,
  className = "",
  containerClassName = "",
  ...props
}) {
  return (
    <Input
      isTextarea={isTextarea}
      className={className}
      containerClassName={containerClassName}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      {...props}
    />
  );
}
