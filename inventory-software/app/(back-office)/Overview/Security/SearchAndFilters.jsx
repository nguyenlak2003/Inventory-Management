import React from "react";

function SearchAndFilters({ onSearch, onFilterChange }) {
  return (
    <div className="flex gap-4 items-center mb-5">
      <label
        htmlFor="search-input"
        className="overflow-hidden absolute p-0 -m-px w-px h-px border-0"
      >
        Search audit logs
      </label>
      <input
        className="p-2.5 rounded border border-solid border-zinc-100 w-[300px]"
        id="search-input"
        type="text"
        placeholder="Search activities..."
        aria-label="Search audit logs"
        onInput={(event) => onSearch(event.target.value)}
      />
      <label
        htmlFor="activity-filter"
        className="overflow-hidden absolute p-0 -m-px w-px h-px border-0"
      >
        Filter by activity type
      </label>
      <select
        className="p-2.5 rounded border border-solid border-zinc-100"
        id="activity-filter"
        aria-label="Filter by activity type"
        onChange={(event) => onFilterChange(event.target.value)}
      >
        <option value="">All Activities</option>
        <option value="login">Login</option>
        <option value="data">Data Access</option>
        <option value="settings">Settings Change</option>
        <option value="security">Security Event</option>
      </select>
    </div>
  );
}

export default SearchAndFilters;
