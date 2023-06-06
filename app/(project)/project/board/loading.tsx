import {
  BoardColumnSkeleton,
  BreadCrumbSkeleton,
  SprintSearchSkeleton,
  TitleSkeleton,
} from "@/components/skeletons";

const BoardSkeleton = () => {
  return (
    <div role="status" className="flex animate-pulse flex-col">
      <BreadCrumbSkeleton />
      <TitleSkeleton />
      <SprintSearchSkeleton />
      <div className="mt-3 flex gap-x-6">
        {[...Array(4).keys()].map((el, index) => (
          <BoardColumnSkeleton key={index} />
        ))}
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default BoardSkeleton;
