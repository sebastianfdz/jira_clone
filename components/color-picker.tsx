import clsx from "clsx";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectPortal,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from "./ui/select";
import { useState } from "react";
import { type IssueType } from "@/utils/types";
import { useIssues } from "@/hooks/query-hooks/use-issues";
import { useIsAuthenticated } from "@/hooks/use-is-authed";

export const LIGHT_COLORS = [
  { hex: "#9f8fef", label: "purple" },
  { hex: "#579dff", label: "blue" },
  { hex: "#4cce97", label: "green" },
  { hex: "#61c6d2", label: "teal" },
  { hex: "#e1b205", label: "yellow" },
  { hex: "#f97463", label: "red" },
  { hex: "#8590a2", label: "gray" },
];

export const DARK_COLORS = [
  { hex: "#6e5dc6", label: "purple" },
  { hex: "#0b66e4", label: "blue" },
  { hex: "#20845a", label: "green" },
  { hex: "#1e7f8c", label: "teal" },
  { hex: "#b65c01", label: "yellow" },
  { hex: "#ca3521", label: "red" },
  { hex: "#616f86", label: "gray" },
];

const ColorPicker: React.FC<{ issue: IssueType }> = ({ issue }) => {
  const [selected, setSelected] = useState<string | null>(
    issue.sprintColor ?? null
  );

  const { updateIssue } = useIssues();
  const [isAuthenticated, openAuthModal] = useIsAuthenticated();

  function handleSelectChange(value: string) {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    setSelected(value);
    updateIssue({ issueId: issue.id, sprintColor: value });
  }

  return (
    <Select onValueChange={handleSelectChange}>
      <SelectTrigger
        onClick={(e) => e.stopPropagation()}
        // disabled={isUpdating}
        className={clsx("flex w-fit items-center gap-x-1 whitespace-nowrap")}
      >
        <SelectValue asChild>
          <ColorSquare color={selected ?? "#9f8fef"} />
        </SelectValue>
      </SelectTrigger>
      <SelectPortal className="z-50 w-full">
        <SelectContent position="popper">
          <SelectViewport className="flex w-full flex-col gap-y-2 rounded-md border border-gray-300 bg-white p-2 shadow-md">
            <SelectGroup>
              <div className="m-0 flex items-center gap-x-2 p-0">
                {LIGHT_COLORS.map((color) => (
                  <SelectItem
                    asChild
                    key={color.hex}
                    value={color.hex}
                    data-state={color.hex == selected ? "checked" : "unchecked"}
                    noBorder
                  >
                    <ColorSquare color={color.hex} />
                  </SelectItem>
                ))}
              </div>
            </SelectGroup>
            <SelectGroup>
              <div className="m-0 flex items-center gap-x-2 p-0">
                {DARK_COLORS.map((color) => (
                  <SelectItem
                    asChild
                    key={color.hex}
                    value={color.hex}
                    data-state={color.hex == selected ? "checked" : "unchecked"}
                    noBorder
                  >
                    <ColorSquare color={color.hex} />
                  </SelectItem>
                ))}
              </div>
            </SelectGroup>
          </SelectViewport>
        </SelectContent>
      </SelectPortal>
    </Select>
  );
};

const ColorSquare: React.FC<{ color: string }> = ({ color }) => {
  return (
    <div
      role="button"
      className="h-6 w-6 rounded-[3px] p-0"
      style={{ backgroundColor: color }}
    ></div>
  );
};

export { ColorPicker };
