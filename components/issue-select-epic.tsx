import { useState, type ReactNode } from "react";
import clsx from "clsx";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectPortal,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from "@/components/ui/select";
import { IssueIcon } from "./issue-icon";

const IssueSelectEpic: React.FC<{
  children: ReactNode;
  currentEpic: { key: string; title: string };
}> = ({ currentEpic, children }) => {
  const epics: { key: string; title: string }[] = Array.from(
    Array(10).keys()
  ).map((el) => {
    return { key: `P-SEBB-${el}`, title: `Epic title ${el}` };
  });

  const [selected, setSelected] = useState<string>(currentEpic.key);
  return (
    <Select onValueChange={setSelected}>
      <SelectTrigger
        className={clsx(
          "flex items-center gap-x-1 rounded-[3px] bg-opacity-30  text-xs font-semibold text-white focus:ring-2"
        )}
      >
        <SelectValue defaultValue={selected}>{children}</SelectValue>
      </SelectTrigger>
      <SelectPortal className="z-10">
        <SelectContent>
          <SelectViewport className="top-10 w-60 rounded-md border border-gray-300 bg-white pt-2 shadow-md">
            <SelectGroup>
              {epics.map((status) => (
                <SelectItem
                  key={status.key}
                  value={status.key}
                  className={clsx(
                    "border-l-[3px] border-transparent py-2 pl-4 text-sm hover:cursor-default  hover:bg-zinc-50 [&[data-state=checked]]:bg-zinc-200"
                  )}
                >
                  <div className="flex">
                    <IssueIcon issueType="EPIC" />
                    <span
                      className={clsx("rounded-md bg-opacity-30 pl-4 text-sm")}
                    >
                      {status.title}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
            <SelectSeparator className="mt-2 h-[1px] bg-gray-300" />
            <button className="w-full py-3 pl-4 text-left text-sm text-zinc-500 hover:cursor-default hover:bg-zinc-100">
              Unlink parent
            </button>
            <button className="w-full py-3 pl-4 text-left text-sm text-zinc-500 hover:cursor-default hover:bg-zinc-100">
              View all epics
            </button>
          </SelectViewport>
        </SelectContent>
      </SelectPortal>
    </Select>
  );
};

export { IssueSelectEpic };
