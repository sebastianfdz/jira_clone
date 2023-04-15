import { type ReactNode } from "react";
import { BsBookmarkFill, BsFillRecordFill } from "react-icons/bs";
import { FaCheck } from "react-icons/fa";
import clsx from "clsx";
import { type IssueType } from "./backlog/issue";

type IssueIconProps = {
  issueType: IssueType["type"];
};

const Icon: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return (
    <div className={clsx("rounded-sm  p-0.5 text-sm text-white", className)}>
      {children}
    </div>
  );
};

const TaskIcon = () => {
  return (
    <Icon className="bg-[#4bade8]">
      <FaCheck className="p-0.5 text-white" />
    </Icon>
  );
};

const StoryIcon = () => {
  return (
    <Icon className="bg-lime-500">
      <BsBookmarkFill className="p-0.5" />
    </Icon>
  );
};

const BugIcon = () => {
  return (
    <Icon className="bg-red-500">
      <BsFillRecordFill />
    </Icon>
  );
};

const IssueIcon: React.FC<IssueIconProps> = ({ issueType }) => {
  if (issueType === "TASK") return <TaskIcon />;
  if (issueType === "STORY") return <StoryIcon />;
  if (issueType === "BUG") return <BugIcon />;
  return null;
};

export { IssueIcon };
