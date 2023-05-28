"use client";
import React from "react";
import { useProject } from "@/hooks/query-hooks/useProject";
import { Avatar } from "../avatar";
import { Button } from "../ui/button";
import { useFiltersContext } from "@/context/useFiltersContext";
import { type Project } from "@prisma/client";
import { EpicFilter } from "./filter-epic";
import { IssueTypeFilter } from "./filter-issue-type";
import { SearchBar } from "./filter-search-bar";

const BacklogHeader: React.FC<{ project: Project }> = ({ project }) => {
  const { search, setSearch } = useFiltersContext();
  return (
    <div className="flex h-fit flex-col">
      <div className="text-sm text-gray-500">Projects / {project.name}</div>
      <h1>Backlog </h1>
      <div className="my-3 flex items-center gap-x-5">
        <SearchBar search={search} setSearch={setSearch} />
        <Members />
        [add_member]
        <EpicFilter />
        <IssueTypeFilter />
      </div>
    </div>
  );
};

const Members = () => {
  const { members } = useProject();
  const { assignees, setAssignees } = useFiltersContext();
  const unassigned = {
    id: "unassigned",
    name: "Unassigned",
    avatar: undefined,
    email: "",
  };

  function handleAssigneeFilter(id: string) {
    setAssignees((prev) => {
      if (prev.includes(id)) return prev.filter((a) => a !== id);
      return [...prev, id];
    });
  }
  if (!members) return <div />;

  return (
    <div className="flex">
      {[...members, unassigned].map((member, index) => {
        return (
          <div
            key={member.id}
            style={{ zIndex: 10 - index }}
            className="hover:!z-10"
          >
            <Button
              onClick={() => handleAssigneeFilter(member.id)}
              customColors
              customPadding
              data-state={
                assignees.includes(member.id) ? "selected" : "not-selected"
              }
              className="-mx-1 flex border-spacing-2 rounded-full border-2 border-transparent bg-white p-0.5 transition-all duration-75 hover:-mt-1.5 [&[data-state=selected]]:border-inprogress"
            >
              <Avatar src={member.avatar} alt={`${member.name}`} />
            </Button>
          </div>
        );
      })}
    </div>
  );
};

export { BacklogHeader };
