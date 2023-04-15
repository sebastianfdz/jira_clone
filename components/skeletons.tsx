const IssueSkeleton: React.FC<{ size: number }> = ({ size }) => {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-x-4">
        <div className="h-3 w-4 rounded-md bg-zinc-100"></div>
        <div className="h-3 w-14 rounded-md bg-zinc-100"></div>
        <div
          style={{ width: size }}
          className="h-3 rounded-md bg-zinc-100"
        ></div>
      </div>
      <div className="flex items-center gap-x-4">
        <div
          style={{ width: size * 0.7 }}
          className="h-4 rounded-md bg-zinc-100"
        ></div>
        <div className="h-6 w-6 rounded-full bg-zinc-100"></div>
      </div>
    </div>
  );
};

const BreadCrumbSkeleton = () => {
  return (
    <div className="mb-3 flex items-center gap-x-4">
      <div className="h-3 w-16 rounded-full bg-zinc-100 "></div>
      <div className="h-3 w-28 rounded-full bg-zinc-100 "></div>
    </div>
  );
};

const TitleSkeleton = () => {
  return (
    <div className="flex items-center justify-between">
      <div className="h-4 w-40 rounded-md bg-zinc-100 "></div>
      <div className="flex gap-x-2">
        {[...Array(3).keys()].map((el, index) => (
          <div key={index} className="h-8 w-8 rounded-md bg-zinc-100"></div>
        ))}
      </div>
    </div>
  );
};

const SprintHeaderSkeleton = () => {
  return (
    <div className="flex items-center justify-between">
      <div className="h-4 w-48 rounded-md bg-zinc-100 "></div>
      <div className="flex gap-x-2">
        <div className="h-8 w-16 rounded-md bg-zinc-100"></div>
        <div className="h-8 w-8 rounded-md bg-zinc-100"></div>
      </div>
    </div>
  );
};

const SprintSearchSkeleton = () => {
  return (
    <div className="mb-3 flex items-center justify-between py-2">
      <div className="flex items-center gap-x-3">
        <div className="h-10 w-32 rounded-md bg-zinc-100"></div>
        <div className="h-8 w-8 rounded-full bg-zinc-100"></div>
        <div className="h-8 w-8 rounded-full bg-zinc-100"></div>
        <div className="ml-2 h-3 w-12 rounded-lg bg-zinc-100"></div>
        <div className="ml-2 h-3 w-12 rounded-lg bg-zinc-100"></div>
      </div>
      <div className="h-8 w-32 rounded-md bg-zinc-100"></div>
    </div>
  );
};

export {
  IssueSkeleton,
  BreadCrumbSkeleton,
  TitleSkeleton,
  SprintHeaderSkeleton,
  SprintSearchSkeleton,
};
