import clsx from "clsx";

const ChildrenTreeIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      className={clsx("h-5 w-5", className)}
      viewBox="0 0 24 24"
      role="presentation"
    >
      <g fill="currentColor" fillRule="evenodd">
        <path d="M11 7h2v5h-2zm5 6h2v3h-2zM6 13h2v3H6z"></path>
        <path d="M7 11h10a1 1 0 011 1v1H6v-1a1 1 0 011-1z"></path>
        <path
          d="M5 18v1h4v-1H5zm0-2h4a2 2 0 012 2v1a2 2 0 01-2 2H5a2 2 0 01-2-2v-1a2 2 0 012-2zm10 2v1h4v-1h-4zm0-2h4a2 2 0 012 2v1a2 2 0 01-2 2h-4a2 2 0 01-2-2v-1a2 2 0 012-2zM10 5v1h4V5h-4zm0-2h4a2 2 0 012 2v1a2 2 0 01-2 2h-4a2 2 0 01-2-2V5a2 2 0 012-2z"
          fillRule="nonzero"
        ></path>
      </g>
    </svg>
  );
};

const BoardIcon: React.FC<{ className?: string; size?: number }> = ({
  className,
  size,
}) => {
  return (
    <svg
      className={className}
      width={size ?? 24}
      height={size ?? 24}
      viewBox="0 0 24 24"
      role="presentation"
    >
      <g fill="currentColor">
        <path d="M4 18h16.008C20 18 20 6 20 6H3.992C4 6 4 18 4 18zM2 5.994C2 4.893 2.898 4 3.99 4h16.02C21.108 4 22 4.895 22 5.994v12.012A1.997 1.997 0 0120.01 20H3.99A1.994 1.994 0 012 18.006V5.994z"></path>
        <path d="M8 6v12h2V6zm6 0v12h2V6z"></path>
      </g>
    </svg>
  );
};
const BacklogIcon: React.FC<{ className?: string; size?: number }> = ({
  className,
  size,
}) => {
  return (
    <svg
      className={className}
      width={size ?? 24}
      height={size ?? 24}
      viewBox="0 0 24 24"
      role="presentation"
    >
      <g fill="currentColor">
        <path d="M5 19.002C5 19 17 19 17 19v-2.002C17 17 5 17 5 17v2.002zm-2-2.004C3 15.894 3.895 15 4.994 15h12.012c1.101 0 1.994.898 1.994 1.998v2.004A1.997 1.997 0 0117.006 21H4.994A1.998 1.998 0 013 19.002v-2.004z"></path>
        <path d="M5 15h12v-2H5v2zm-2-4h16v6H3v-6z"></path>
        <path d="M7 11.002C7 11 19 11 19 11V8.998C19 9 7 9 7 9v2.002zM5 8.998C5 7.894 5.895 7 6.994 7h12.012C20.107 7 21 7.898 21 8.998v2.004A1.997 1.997 0 0119.006 13H6.994A1.998 1.998 0 015 11.002V8.998z"></path>
        <path d="M5 5v2h12V5H5zm-2-.002C3 3.894 3.895 3 4.994 3h12.012C18.107 3 19 3.898 19 4.998V9H3V4.998z"></path>
      </g>
    </svg>
  );
};
const RoadmapIcon: React.FC<{ className?: string; size?: number }> = ({
  className,
  size,
}) => {
  return (
    <svg
      className={className}
      width={size ?? 24}
      height={size ?? 24}
      viewBox="0 0 24 24"
      role="presentation"
    >
      <path
        d="M6 2h10a3 3 0 010 6H6a3 3 0 110-6zm0 2a1 1 0 100 2h10a1 1 0 000-2H6zm4 5h8a3 3 0 010 6h-8a3 3 0 010-6zm0 2a1 1 0 000 2h8a1 1 0 000-2h-8zm-4 5h6a3 3 0 010 6H6a3 3 0 010-6zm0 2a1 1 0 000 2h6a1 1 0 000-2H6z"
        fill="currentColor"
        fillRule="evenodd"
      ></path>
    </svg>
  );
};

export { ChildrenTreeIcon, BacklogIcon, BoardIcon, RoadmapIcon };
