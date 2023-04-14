import clsx from "clsx";
import Link from "next/link";
import React, { Fragment } from "react";

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  href?: string;
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, href, ...props }, ref) => {
    return (
      <Fragment>
        {href ? (
          <Link href={href}>{children}</Link>
        ) : (
          <button
            className={clsx(
              "inline-flex items-center gap-x-1.5 rounded-[3px] bg-zinc-200 px-2.5 py-1.5 hover:bg-zinc-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
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
