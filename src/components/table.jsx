import React, { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";
import SideDetailsPanel from "./SideDetailsPanel";
import Pagination from "./Pagination";
import { useUser } from "../context/UserContext";

const Table = ({ endpoint }) => {
    const { user } = useUser();
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [isEditable, setIsEditable] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        const role = user?.role || '';
        const dept = user?.department || null;
        setIsEditable(dept === "HR" && (role.toLowerCase() === 'manager' || role.toLowerCase() === 'director'));
    }, [user]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            await apiFetch(endpoint)
                .then(async (res) => {
                    if (!res || !res.ok) throw new Error("Failed to fetch data");
                    const arr = await res.json();
                    setData(arr.data || []);
                    if (arr.data.length > 0) {
                        setColumns(Object.keys(arr.data[0]));
                    } else {
                        setColumns([]);
                    }
                })
                .catch((err) => {
                    setError(err.message || "Unknown error");
                })
                .finally(() => setLoading(false));
        };

        fetchData();
        setCurrentPage(1);
    }, [endpoint]);

    const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
    const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (size) => {
        setPageSize(size);
        setCurrentPage(1);
    };

    return (
        <>
            <div className="p-2 sm:p-4 bg-base-100 flex-1 flex flex-col rounded-lg">
                {/* filter */}
                <div className="flex flex-col sm:flex-row justify-end gap-2 p-2 mb-4 bg-base-200">
                    <div className="flex gap-2">
                        <button className="shadow-sm hover:shadow-md px-3 py-2 rounded text-sm bg-base-100 whitespace-nowrap">
                            Customize Columns
                        </button>
                        <button className="shadow-sm hover:shadow-md px-3 py-2 rounded text-sm bg-base-100">
                            Filter
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto flex-1">
                    {loading ? (
                        <div className="p-8 text-center">Loading...</div>
                    ) : error ? (
                        <div className="p-8 text-center text-red-500">{error}</div>
                    ) : data.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No data to display.</div>
                    ) : (
                        <table className="table w-full text-sm border-collapse rounded-lg min-w-[700px]">
                            <thead className="bg-[#eef3ff] text-gray-600">
                                <tr>
                                    {columns.map((col, idx) => (
                                        <th
                                            key={col}
                                            className={`text-left p-3 min-w-[250px] ${idx === 0 ? "rounded-tl-lg" : ""} ${idx === columns.length - 1 ? "rounded-tr-lg" : ""}`}
                                        >
                                            {col.replace(/_/g, " ").toUpperCase()}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedData.map((row, i) => (
                                    <tr key={row.id || i} className="border-b border-gray-200 hover:bg-gray-50">
                                        {columns.map((col) => {
                                            let value = row[col];
                                            if (typeof value === "object" && value !== null) {
                                                value = JSON.stringify(value);
                                            }
                                            if (col === "full_name") {
                                                return (
                                                    <td
                                                        key={col}
                                                        className="p-3 text-left whitespace-nowrap underline text-blue-800 hover:underline cursor-pointer font-semibold"
                                                        onClick={() => setSelectedRow(row)}
                                                    >
                                                        {value}
                                                    </td>
                                                );
                                            }
                                            return (
                                                <td key={col} className="p-3 text-left whitespace-nowrap">{value}</td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <SideDetailsPanel
                    isOpen={!!selectedRow}
                    data={selectedRow}
                    columns={columns}
                    onClose={() => setSelectedRow(null)}
                    isEditable={isEditable}
                />
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                />
            </div>
        </>

    );
};

export default Table;