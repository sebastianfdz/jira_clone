import { type ReactNode } from "react";
import { BsBookmarkFill, BsFillRecordFill } from "react-icons/bs";
import { FaCheck } from "react-icons/fa";
import { HiLightningBolt } from "react-icons/hi";
import clsx from "clsx";
import { type Issue as IssueType } from "@prisma/client";
import { SubTaskIcon } from "../svgs";

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

const _SubTaskIcon = () => {
  return (
    <Icon className="h-fit bg-task">
      <SubTaskIcon className="text-white" />
    </Icon>
  );
};

const TaskIcon = () => {
  return (
    <Icon className="h-fit bg-task">
      <FaCheck className=" p-0.5 text-white" />
    </Icon>
  );
};

const StoryIcon = () => {
  return (
    <Icon className="h-fit bg-story">
      <BsBookmarkFill className="p-0.5" />
    </Icon>
  );
};

const BugIcon = () => {
  return (
    <Icon className="h-fit bg-bug">
      <BsFillRecordFill />
    </Icon>
  );
};

const EpicIcon = () => {
  return (
    <Icon className="h-fit bg-epic">
      <HiLightningBolt />
    </Icon>
  );
};

const IssueIcon: React.FC<IssueIconProps> = ({ issueType }) => {
  if (issueType === "TASK") return <TaskIcon />;
  if (issueType === "STORY") return <StoryIcon />;
  if (issueType === "BUG") return <BugIcon />;
  if (issueType === "EPIC") return <EpicIcon />;
  if (issueType === "SUBTASK") return <_SubTaskIcon />;
  return null;
};

export { IssueIcon };
