"use client";
import React from "react";
import { useFiltersContext } from "@/context/use-filters-context";
import { type Project } from "@prisma/client";
import { EpicFilter } from "@/components/filter-epic";
import { IssueTypeFilter } from "@/components/filter-issue-type";
import { SearchBar } from "@/components/filter-search-bar";
import { Members } from "../members";
import { ClearFilters } from "../filter-issue-clear";
import { SprintFilter } from "../filter-sprint";
import { NotImplemented } from "../not-implemented";
import { BiLineChart } from "react-icons/bi";
import { Button } from "../ui/button";

const RoadmapHeader: React.FC<{ project: Project }> = ({ project }) => {
  const { search, setSearch } = useFiltersContext();
  return (
    <div className="flex h-fit flex-col">
      <div className="text-sm text-gray-500">Projects / {project.name}</div>
      <h1>Roadmap </h1>
      <div className="my-3 flex items-center justify-between">
        <div className="flex items-center gap-x-5">
          <SearchBar search={search} setSearch={setSearch} />
          <Members />
          <EpicFilter />
          <IssueTypeFilter />
          <SprintFilter />
          <ClearFilters />
        </div>
        <NotImplemented feature="insights">
          <Button className="flex items-center gap-x-2">
            <BiLineChart className="text-gray-900" />
            <span className="text-sm text-gray-900">Insights</span>
          </Button>
        </NotImplemented>
      </div>
    </div>
  );
};

export { RoadmapHeader };
