import React from "react";

function OrderSummaryCard({
  title,
  type,
  data,
  selectedTimeRange,
  timeRangeOptions,
  onTimeRangeChange,
  valueLabel,
  valuePrefix,
}) {
  return (
    <article className="p-8 text-center rounded-xl transition-transform bg-[white] duration-[0.2s] shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
      <div className="flex gap-4 justify-center items-center mb-5">
        <h2 className="m-0 text-zinc-800">{title}</h2>
        <select
          className="p-2 rounded-md border border-solid cursor-pointer bg-[white] border-zinc-300 text-zinc-800"
          id={`${type}-time-range`}
          aria-label={`${title} Time Range`}
          value={selectedTimeRange}
          onChange={(event) => onTimeRangeChange(event.target.value)}
        >
          {timeRangeOptions?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4 text-lg text-stone-500">
        <span>Quantity: </span>
        <span className="text-red-600 font-[bold]">{data.quantity}</span>
      </div>
      <div className="text-lg text-stone-500">
        <span>{valueLabel}: </span>
        <span className="text-red-600 font-[bold]">
          <span>{valuePrefix}</span>
          <span>
            {type === "purchases"
              ? data.totalCost.toLocaleString()
              : data.totalRevenue.toLocaleString()}
          </span>
        </span>
      </div>
    </article>
  );
}

export default OrderSummaryCard;
