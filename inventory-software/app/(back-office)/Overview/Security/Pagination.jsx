import React from "react";

function Pagination({ currentPage, totalPages, onPrevPage, onNextPage }) {
  return (
    <div className="flex gap-2.5 justify-center mt-5">
      <button
        className="px-3 py-2 text-red-600 rounded border border-red-600 border-solid cursor-pointer hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Previous page"
        disabled={currentPage === 1}
        onClick={(event) => onPrevPage()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onPrevPage();
          }
        }}
      >
        Previous
      </button>
      <span className="px-3 py-2 text-zinc-600">
        Page {currentPage} of {totalPages}
      </span>
      <button
        className="px-3 py-2 bg-red-700 rounded border border-red-700 border-solid cursor-pointer text-[white] hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Next page"
        disabled={currentPage === totalPages}
        onClick={(event) => onNextPage()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onNextPage();
          }
        }}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
