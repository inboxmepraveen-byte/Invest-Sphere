import { classNames } from "../utils/formatting";
import "./Button.css";

export default function Button({
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  className,
  children,
  ...rest
}) {
  return (
    <button
      className={classNames("btn", `btn-${variant}`, `btn-${size}`, className)}
      {...rest}
    >
      {Icon && iconPosition === "left" && <Icon size={size === "sm" ? 14 : 16} />}
      {children && <span>{children}</span>}
      {Icon && iconPosition === "right" && <Icon size={size === "sm" ? 14 : 16} />}
    </button>
  );
}
