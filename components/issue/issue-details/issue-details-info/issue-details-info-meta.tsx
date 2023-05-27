import { dateToLongString } from "@/utils/helpers";
import { type IssueType } from "@/utils/types";

const IssueMetaInfo: React.FC<{ issue: IssueType }> = ({ issue }) => {
  return (
    <div className="mb-3 flex flex-col gap-y-3">
      <span className="text-xs text-gray-500">
        {"Created " + dateToLongString(issue.createdAt)}
      </span>
      <span className="text-xs text-gray-500">
        {"Updated " + dateToLongString(issue.updatedAt)}
      </span>
    </div>
  );
};

export { IssueMetaInfo };
