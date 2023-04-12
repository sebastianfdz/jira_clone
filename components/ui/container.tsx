import clsx from "clsx";
import { type ReactNode } from "react";

export const Container: React.FC<{
  className?: string;
  children: ReactNode;
  screen?: boolean;
}> = ({ className, screen, children }) => {
  return (
    <div
      className={clsx(
        screen
          ? "item flex h-screen w-screen items-center justify-center"
          : "max-w-9xl mx-auto px-4 sm:p-2 lg:p-4",
        className
      )}
    >
      {children}
    </div>
  );
};
