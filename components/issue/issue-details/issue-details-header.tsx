import { MdClose, MdOutlineShare, MdRemoveRedEye } from "react-icons/md";
import { AiOutlineLike } from "react-icons/ai";
import { IssueDropdownMenu } from "../issue-menu";
import { DropdownTrigger } from "../../ui/dropdown-menu";
import { IssuePath } from "../issue-path";
import { type IssueType } from "@/utils/types";
import { NotImplemented } from "@/components/not-implemented";
import { Button } from "@/components/ui/button";
import { BsThreeDots } from "react-icons/bs";

const IssueDetailsHeader: React.FC<{
  issue: IssueType;
  setIssueKey: React.Dispatch<React.SetStateAction<string | null>>;
  isInViewport: boolean;
}> = ({ issue, setIssueKey, isInViewport }) => {
  if (!issue) return <div />;
  return (
    <div
      data-state={isInViewport ? "inViewport" : "notInViewport"}
      className="sticky top-0 z-10 flex h-fit w-full items-center justify-between border-b-2 border-transparent bg-white p-0.5 [&[data-state=notInViewport]]:border-gray-200"
    >
      <IssuePath issue={issue} setIssueKey={setIssueKey} />
      <div className="relative flex items-center gap-x-0.5">
        <NotImplemented feature="watch">
          <Button customColors className="bg-transparent hover:bg-gray-200">
            <MdRemoveRedEye className="text-xl" />
          </Button>
        </NotImplemented>
        <NotImplemented feature="like">
          <Button customColors className="bg-transparent hover:bg-gray-200">
            <AiOutlineLike className="text-xl" />
          </Button>
        </NotImplemented>
        <NotImplemented feature="share">
          <Button customColors className="bg-transparent hover:bg-gray-200">
            <MdOutlineShare className="text-xl" />
          </Button>
        </NotImplemented>
        <IssueDropdownMenu issue={issue}>
          <DropdownTrigger
            asChild
            className="rounded-m flex items-center gap-x-1 bg-opacity-30 p-2 text-xs font-semibold focus:ring-2 [&[data-state=open]]:bg-gray-700 [&[data-state=open]]:text-white"
          >
            <div className="rounded-[3px] text-gray-800 hover:bg-gray-200">
              <BsThreeDots className="sm:text-xl" />
            </div>
          </DropdownTrigger>
        </IssueDropdownMenu>
        <Button
          customColors
          className="bg-transparent hover:bg-gray-200"
          onClick={() => setIssueKey(null)}
        >
          <MdClose className="text-2xl" />
        </Button>
      </div>
    </div>
  );
};

export { IssueDetailsHeader };
