import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "outline" | "ghost";

const variantClass: Record<Variant, string> = {
  primary: "btn-primary",
  outline: "btn-outline",
  ghost: "btn-ghost",
};

type CommonProps = {
  variant?: Variant;
  className?: string;
  children: ReactNode;
  href?: string;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  disabled?: boolean;
  "aria-label"?: string;
};

/** Renders a Next <Link> when `href` is set, otherwise a <button>. */
export function Button({
  variant = "primary",
  className = "",
  children,
  href,
  ...rest
}: CommonProps) {
  const classes = `${variantClass[variant]} ${className}`;
  if (href) {
    const isExternal = href.startsWith("http");
    return (
      <Link
        href={href}
        className={classes}
        aria-label={rest["aria-label"]}
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </Link>
    );
  }
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
