"use client";
import { useEffect, useMemo, useState } from "react";
import { useFocus } from "@/hooks/useFocus";
import { BsX } from "react-icons/bs";
import { MdSearch } from "react-icons/md";
import debounce from "lodash.debounce";
import { useProject } from "@/hooks/useProject";
import { Avatar } from "../avatar";
import { Button } from "../ui/button";
import { useFiltersContext } from "@/context/useFilters";
import { type Project } from "@prisma/client";

const BacklogHeader: React.FC<{ project: Project }> = ({ project }) => {
  const { search, setSearch } = useFiltersContext();
  return (
    <div className="flex h-fit flex-col">
      <div className="text-sm text-gray-500">Projects / {project.name}</div>
      <h1>Backlog </h1>
      <div className="my-3 flex items-center gap-x-5">
        <SearchBar search={search} setSearch={setSearch} />
        <Members />
        [add_member][epic_filter][type_filter]
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
              className="-mx-1 flex border-spacing-2 rounded-full border-2 border-transparent bg-white p-0.5 transition-all duration-300 hover:-mt-1.5 [&[data-state=selected]]:border-inprogress"
            >
              <Avatar size={35} src={member.avatar} alt={`${member.name}`} />
            </Button>
          </div>
        );
      })}
    </div>
  );
};

const SearchBar: React.FC<{
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}> = ({ search, setSearch }) => {
  const [ref, isFocused] = useFocus();

  const [localSearch, setLocalSearch] = useState(search);

  const debouncedSetSearch = useMemo(
    () => debounce((str: string) => setSearch(str), 350),
    [setSearch]
  );

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setLocalSearch(e.target.value);
    debouncedSetSearch(e.target.value);
  }

  function handleClearSearch() {
    setLocalSearch("");
    setSearch("");
  }

  useEffect(() => {
    return () => {
      debouncedSetSearch.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative flex w-fit items-center">
      <input
        type="text"
        ref={ref}
        data-state={isFocused ? "focused" : "not-focused"}
        className="inset-2 h-full rounded-sm border-2 border-gray-300 bg-gray-50 px-2 py-2 text-sm outline-blue-400 transition-all duration-300 hover:bg-gray-200 focus:bg-white focus:outline-2 [&[data-state=focused]]:pr-8 [&[data-state=focused]]:placeholder:text-gray-500 [&[data-state=not-focused]]:placeholder:text-transparent"
        value={localSearch}
        onChange={handleSearch}
        placeholder="Search backlog"
      />

      <MdSearch
        data-state={search.length ? "searching" : "not-searching"}
        className="absolute bottom-0 right-0 top-0 mx-2 flex h-full items-center text-lg text-gray-500 [&[data-state=searching]]:hidden"
      />
      <button
        data-state={search.length ? "searching" : "not-searching"}
        onClick={handleClearSearch}
        className="[&[data-state=not-searching]]:hidden"
      >
        <BsX className="absolute bottom-0 right-0 top-0 mx-2 flex h-full items-center text-lg text-gray-500 " />
      </button>
    </div>
  );
};

export { BacklogHeader };
