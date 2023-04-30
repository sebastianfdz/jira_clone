import clsx from "clsx";

const Spinner: React.FC<{ size?: "sm" | "md" | "lg"; white?: boolean }> = ({
  size = "md",
  white,
}) => {
  return (
    <div
      aria-label="loading"
      className={clsx(
        size === "sm" && "h-6 w-6",
        size === "md" && "h-8 w-8",
        size === "lg" && "h-12 w-12",
        white ? "border-white" : "border-blue-500",
        "animate-spin rounded-full border-4 border-solid border-t-transparent"
      )}
    />
  );
};

export { Spinner };
