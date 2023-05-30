"use client";
import React from "react";
import { useFiltersContext } from "@/context/useFiltersContext";
import { type Project } from "@prisma/client";
import { EpicFilter } from "@/components/filter-epic";
import { IssueTypeFilter } from "@/components/filter-issue-type";
import { SearchBar } from "@/components/filter-search-bar";
import { Members } from "../members";

const BacklogHeader: React.FC<{ project: Project }> = ({ project }) => {
  const { search, setSearch } = useFiltersContext();
  return (
    <div className="flex h-fit flex-col">
      <div className="text-sm text-gray-500">Projects / {project.name}</div>
      <h1>Backlog </h1>
      <div className="my-3 flex items-center gap-x-5">
        <SearchBar search={search} setSearch={setSearch} />
        <Members />
        <EpicFilter />
        <IssueTypeFilter />
      </div>
    </div>
  );
};

export { BacklogHeader };
