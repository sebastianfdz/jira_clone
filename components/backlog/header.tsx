"use client";
import { useEffect, useMemo, useState } from "react";
import { useFocus } from "@/hooks/useFocus";
import { BsX } from "react-icons/bs";
import { MdSearch } from "react-icons/md";
import debounce from "lodash.debounce";

const BacklogHeader: React.FC<{
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}> = ({ search, setSearch }) => {
  return (
    <div className="flex h-fit flex-col">
      <div className="text-sm text-gray-500">Projects / Clone</div>
      <h1>Backlog </h1>
      <SearchBar search={search} setSearch={setSearch} />
      [members][add_member][epic_filter][type_filter]
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
