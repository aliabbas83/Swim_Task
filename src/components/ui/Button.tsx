import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "@/lib/cx";
import styles from "./Button.module.css";

type ButtonVariant = "primary" | "secondary" | "cta" | "dashed" | "ghost" | "ghostDanger" | "onDark";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: "md" | "lg";
  fullWidth?: boolean;
  icon?: ReactNode;
  iconPosition?: "start" | "end";
  className?: string;
  children: ReactNode;
}

type ButtonAsLink = ButtonBaseProps & { href: string; "aria-label"?: string };
type ButtonAsButton = ButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & { href?: undefined };

export type ButtonProps = ButtonAsLink | ButtonAsButton;

/** Renders a `<Link>` when given an `href`, otherwise a `<button>`. */
export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    fullWidth,
    icon,
    iconPosition = "start",
    className,
    children,
    ...rest
  } = props;

  const classes = cx(styles.button, styles[variant], styles[size], fullWidth && styles.fullWidth, className);
  const content = (
    <>
      {icon && iconPosition === "start" && <span className={styles.icon}>{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === "end" && <span className={styles.icon}>{icon}</span>}
    </>
  );

  if (rest.href !== undefined) {
    return (
      <Link href={rest.href} className={classes} aria-label={rest["aria-label"]}>
        {content}
      </Link>
    );
  }

  const { href: _href, type = "button", ...buttonProps } = rest;
  void _href;

  return (
    <button type={type} className={classes} {...buttonProps}>
      {content}
    </button>
  );
}
