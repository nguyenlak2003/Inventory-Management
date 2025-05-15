import React from "react";
import TimeRangeSelector from "./TimeRangeSelector";

function OrderSummary({
  title,
  quantity,
  totalAmount,
  amountLabel,
  timeRange,
  timeRangeOptions,
  onTimeRangeChange,
}) {
  return (
    <section className="p-8 text-center rounded-xl transition-transform bg-[white] duration-[0.2s] shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
      <div className="flex gap-4 justify-center items-center mb-5">
        <h2 className="m-0 text-zinc-800">{title}</h2>
        <TimeRangeSelector
          id={`${title.toLowerCase().replace(/\s+/g, "-")}-time-range`}
          ariaLabel={`${title} Time Range`}
          value={timeRange}
          options={timeRangeOptions}
          onChange={onTimeRangeChange}
        />
      </div>

      <div className="mb-4 text-lg text-stone-500">
        <span>Quantity: </span>
        <span className="text-red-600 font-[bold]">{quantity}</span>
      </div>

      <div className="text-lg text-stone-500">
        <span>{amountLabel}: </span>
        <span className="text-red-600 font-[bold]">
          <span>$</span>
          <span>{totalAmount.toLocaleString()}</span>
        </span>
      </div>
    </section>
  );
}

export default OrderSummary;
