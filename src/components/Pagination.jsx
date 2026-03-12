import React from "react";

const Pagination = ({ currentPage, totalPages, pageSize, totalRecords, onPageChange, onPageSizeChange }) => {
    const getPageNumbers = () => {
        const windowSize = 5;
        let start = Math.max(1, currentPage - 2);
        let end = Math.min(totalPages, start + windowSize - 1);
        if (end - start + 1 < windowSize) {
            start = Math.max(1, end - windowSize + 1);
        }
        const range = [];
        for (let i = start; i <= end; i++) {
            range.push(i);
        }
        return range;
    };

    return (
        <div className="flex flex-wrap justify-between items-center gap-3 mt-auto pt-2 text-sm">

            <div className="flex flex-wrap gap-2 sm:gap-4 items-center px-1">
                <button
                    className={`px-3 py-1 rounded ${currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"}`}
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Prev
                </button>

                {getPageNumbers().map((page) => (
                    <button
                        key={page}
                        className={`px-3 py-1 rounded ${page === currentPage
                            ? "bg-blue-900 text-white"
                            : "hover:bg-gray-100 text-gray-700"
                            }`}
                        onClick={() => onPageChange(page)}
                    >
                        {page}
                    </button>
                ))}

                <button
                    className={`px-3 py-1 rounded ${currentPage === totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"}`}
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>

                <span className="text-gray-400 ml-2">{`Page ${currentPage} of ${totalPages}`}</span>
            </div>

            <div className="bg-[#eef3ff] p-2 sm:py-2 sm:px-5 rounded-lg text-sm">
               <span className="font-bold">Page Size:</span> 
                <select
                    className="ml-2 border rounded px-2 py-1"
                    value={pageSize}
                    onChange={(e) => onPageSizeChange(Number(e.target.value))}
                >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                </select>
            </div>

        </div>
    );
};

export default Pagination;
