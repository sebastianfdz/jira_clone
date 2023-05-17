import clsx from "clsx";

const Spinner: React.FC<{ size?: "sm" | "md" | "lg"; white?: boolean }> = ({
  size = "md",
  white,
}) => {
  return (
    <div
      aria-label="loading"
      className={clsx(
        size === "sm" && "h-4 w-4",
        size === "md" && "h-8 w-8",
        size === "lg" && "h-12 w-12",
        white ? "border-white" : "border-blue-900",
        "animate-spin rounded-full border-2 border-solid border-t-transparent"
      )}
    />
  );
};

export { Spinner };
