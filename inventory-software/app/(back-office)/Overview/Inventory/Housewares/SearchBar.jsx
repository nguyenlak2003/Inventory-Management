import React from "react";

function SearchBar({ searchQuery, handleSearch, activeTab }) {
  return (
    <div className="relative">
      <label htmlFor="search-input" className="absolute left-[-9999px]">
        <span>Search </span>
        <span>{activeTab}</span>
      </label>
      <input
        id="search-input"
        type="search"
        placeholder="Search..."
        className="py-2.5 pr-2.5 pl-9 rounded border border-solid border-zinc-300 w-[300px]"
        value={searchQuery}
        aria-label={`Search ${activeTab}`}
        onChange={handleSearch}
      />
      <span className="absolute left-2.5 top-2/4 -translate-y-2/4 text-stone-500">
        🔍
      </span>
    </div>
  );
}

export default SearchBar;
