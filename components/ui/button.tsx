import clsx from "clsx";
import Link from "next/link";
import React, { Fragment } from "react";

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  customColors?: boolean;
  href?: string;
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, customColors, href, ...props }, ref) => {
    return (
      <Fragment>
        {href ? (
          <Link href={href}>{children}</Link>
        ) : (
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
        )}
      </Fragment>
    );
  }
);
Button.displayName = "Button";

export { Button };
