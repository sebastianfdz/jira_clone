import clsx from "clsx";
import Link from "next/link";
import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  customColors?: boolean;
  customPadding?: boolean;
  href?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { children, className, customColors, customPadding, href, ...props },
    ref
  ) => {
    if (href) return <Link href={href}>{children}</Link>;
    return (
      <button
        className={clsx(
          !customColors && "bg-zinc-200 hover:bg-zinc-300",
          !customPadding && "p-1.5",
          "inline-flex items-center rounded-[3px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
