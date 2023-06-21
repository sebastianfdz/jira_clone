import React, { useEffect, useMemo, useState } from "react";
import { useFocus } from "@/hooks/use-focus";
import { MdSearch } from "react-icons/md";
import debounce from "lodash.debounce";
import { BsX } from "react-icons/bs";
import clsx from "clsx";

const SearchBar: React.FC<{
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  fullWidth?: boolean;
  placeholder?: string;
}> = ({ search, setSearch, fullWidth, placeholder }) => {
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
    <div
      className={clsx(
        fullWidth ? "w-full" : "w-fit",
        "relative flex items-center"
      )}
    >
      <label htmlFor="issue-search" className="sr-only">
        Issue search filter
      </label>
      <input
        type="text"
        id="issue-search"
        ref={ref}
        data-state={isFocused ? "focused" : "not-focused"}
        className={clsx(
          fullWidth ? " w-full min-w-max" : "[&[data-state=focused]]:pr-8",
          "inset-2 h-full rounded-sm border-2 border-gray-300 bg-gray-50 px-2 py-2 text-sm outline-blue-400 transition-all duration-300 hover:bg-gray-200 focus:bg-white focus:outline-2  [&[data-state=focused]]:placeholder:text-gray-500 [&[data-state=not-focused]]:placeholder:text-transparent"
        )}
        value={localSearch}
        onChange={handleSearch}
        placeholder={placeholder ?? "Search backlog"}
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

export { SearchBar };
