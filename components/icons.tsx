import clsx from "clsx";

const ChildrenTreeIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      className={clsx("h-5 w-5", className)}
      viewBox="0 0 24 24"
      role="presentation"
    >
      <g fill="currentColor" fill-rule="evenodd">
        <path d="M11 7h2v5h-2zm5 6h2v3h-2zM6 13h2v3H6z"></path>
        <path d="M7 11h10a1 1 0 011 1v1H6v-1a1 1 0 011-1z"></path>
        <path
          d="M5 18v1h4v-1H5zm0-2h4a2 2 0 012 2v1a2 2 0 01-2 2H5a2 2 0 01-2-2v-1a2 2 0 012-2zm10 2v1h4v-1h-4zm0-2h4a2 2 0 012 2v1a2 2 0 01-2 2h-4a2 2 0 01-2-2v-1a2 2 0 012-2zM10 5v1h4V5h-4zm0-2h4a2 2 0 012 2v1a2 2 0 01-2 2h-4a2 2 0 01-2-2V5a2 2 0 012-2z"
          fill-rule="nonzero"
        ></path>
      </g>
    </svg>
  );
};

export { ChildrenTreeIcon };
