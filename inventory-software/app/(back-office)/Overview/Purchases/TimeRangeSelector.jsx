import React from "react";

function TimeRangeSelector({ id, ariaLabel, value, options, onChange }) {
  return (
    <select
          className="text-gray-400 p-2 rounded-md border border-solid cursor-pointer bg-[white] border-zinc-300 text-zinc-800"
      id={id}
      aria-label={ariaLabel}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      {options?.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export default TimeRangeSelector;
