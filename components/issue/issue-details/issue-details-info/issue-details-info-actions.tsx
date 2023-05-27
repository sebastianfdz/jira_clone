import { NotImplemented } from "@/components/not-implemented";
import { ChildrenTreeIcon } from "@/components/svgs";
import { Button } from "@/components/ui/button";
import { BiLink } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { CgAttachment } from "react-icons/cg";

const IssueDetailsInfoActions = () => {
  return (
    <div className="flex gap-x-2 text-gray-700">
      <NotImplemented feature="attachment">
        <Button customColors className="bg-gray-100 hover:bg-gray-200">
          <CgAttachment className="rotate-45 text-xl" />
        </Button>
      </NotImplemented>
      <Button customColors className="bg-gray-100 hover:bg-gray-200">
        <ChildrenTreeIcon />
      </Button>
      <NotImplemented feature="link">
        <Button customColors className="bg-gray-100 hover:bg-gray-200">
          <BiLink className="text-xl" />
        </Button>
      </NotImplemented>
      <NotImplemented feature="add apps">
        <Button customColors className="bg-gray-100 hover:bg-gray-200">
          <BsThreeDots className="text-xl" />
        </Button>
      </NotImplemented>
    </div>
  );
};

export { IssueDetailsInfoActions };
