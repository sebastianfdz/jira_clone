import clsx from "clsx";
import Link from "next/link";
import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  customColors?: boolean;
  customPadding?: boolean;
  href?: string;
  target?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      customColors,
      customPadding,
      href,
      target,
      ...props
    },
    ref
  ) => {
    if (href)
      return (
        <Link
          href={href}
          target={target ?? "_self"}
          className={clsx(
            !customColors && "bg-gray-200 hover:bg-gray-300",
            !customPadding && "p-1.5",
            "inline-flex items-center rounded-[3px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
            className
          )}
        >
          {children}
        </Link>
      );
    return (
      <button
        className={clsx(
          !customColors &&
            "bg-gray-200 font-medium text-gray-600 hover:bg-gray-300",
          !customPadding && "p-1.5",
          "inline-flex items-center rounded-[3px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1",
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
