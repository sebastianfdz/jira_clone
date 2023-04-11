import clsx from "clsx";
import { type ReactNode } from "react";

export const Container: React.FC<{
  className?: string;
  children: ReactNode;
}> = ({ className, children }) => {
  return (
    <div className={clsx("max-w-9xl mx-auto px-4 sm:p-2 lg:p-4", className)}>
      {children}
    </div>
  );
};
