import React from "react";

function StatsCard({
  title,
  timeRange,
  onTimeRangeChange,
  timeRangeOptions,
  quantity,
  amount,
  amountLabel,
}) {
  return (
    <div className="p-8 text-center rounded-xl transition-transform bg-[white] duration-[0.2s] shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
      <div className="flex gap-4 justify-center items-center mb-5">
        <h2 className="m-0 text-zinc-800">{title}</h2>
        <select
          className="p-2 rounded-md border border-solid cursor-pointer bg-[white] border-zinc-300 text-zinc-800"
          id={`${title.toLowerCase().replace(/\s+/g, "-")}-time-range`}
          aria-label={`${title} Time Range`}
          value={timeRange}
          onChange={(event) => onTimeRangeChange(event.target.value)}
        >
          {timeRangeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4 text-lg text-stone-500">
        <span>Quantity: </span>
        <span className="text-red-600 font-[bold]">{quantity}</span>
      </div>
      <div className="text-lg text-stone-500">
        <span>{amountLabel}: </span>
        <span className="text-red-600 font-[bold]">
          <span>$</span>
          <span>{amount.toLocaleString()}</span>
        </span>
      </div>
    </div>
  );
}

export default StatsCard;
