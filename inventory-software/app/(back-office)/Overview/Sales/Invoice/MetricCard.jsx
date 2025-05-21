import React from "react";

function MetricCard({
  title,
  timeRange,
  timeRangeOptions,
  onTimeRangeChange,
  metrics,
}) {
  return (
    <article className="p-8 text-center rounded-xl transition-transform bg-white duration-[0.2s] shadow-[0_2px_4px_rgba(0,0,0,0.1)] hover:shadow-md">
      <div className="flex gap-4 justify-center items-center mb-5">
        <h2 className="m-0 text-xl font-semibold text-zinc-800">{title}</h2>
        <select
          className="p-2 rounded-md border border-solid cursor-pointer bg-white border-zinc-300 text-zinc-800"
          id={`${title.toLowerCase().replace(/\s+/g, "-")}-time-range`}
          aria-label={`${title} Time Range`}
          value={timeRange}
          onChange={(e) => onTimeRangeChange(e.target.value)}
        >
          {timeRangeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {metrics.map((metric, index) => (
        <div
          key={metric.label}
          className={`text-lg text-stone-500 ${index !== metrics.length - 1 ? "mb-4" : ""}`}
        >
          <span className="font-medium">{metric.label}: </span>
          <span className="text-red-600 font-bold">{metric.value}</span>
        </div>
      ))}
    </article>
  );
}

export default MetricCard;
