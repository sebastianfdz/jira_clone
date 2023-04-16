import clsx from "clsx";
import Link from "next/link";
import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  customColors?: boolean;
  href?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, customColors, href, ...props }, ref) => {
    if (href) return <Link href={href}>{children}</Link>;
    return (
      <button
        className={clsx(
          !customColors && "bg-zinc-200 hover:bg-zinc-300",
          "inline-flex items-center gap-x-1.5 rounded-[3px]  px-2.5 py-1.5  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
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
