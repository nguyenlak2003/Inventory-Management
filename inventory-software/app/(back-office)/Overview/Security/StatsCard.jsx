import React from "react";

function StatsCard({ title, value, className = "" }) {
  return (
    <div
      className={`p-5 rounded-lg border border-solid border-zinc-100 shadow-[0_2px_4px_rgba(0,0,0,0.1)] ${className}`}
    >
      <h3 className="mx-0 mt-0 mb-2.5 text-zinc-900">{title}</h3>
      <p className="m-0 text-2xl text-red-700 font-[bold]">{value}</p>
    </div>
  );
}

export default StatsCard;
