import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { apiFetch } from "../utils/api";
import SideDetailsPanel from "./SideDetailsPanel";

const Table = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const view = searchParams.get("view");
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [isEditable, setIsEditable] = useState(false);


    //In future will replace this with actual endpoint to get user info 
    useEffect(() => {
        apiFetch("/api/employee/profile")
            .then(async (res) => {
                if (!res || !res.ok) return;
                const json = await res.json();
                const role = json?.data?.role || '';
                const dept = json?.data?.department || null;
                setIsEditable(dept === "HR" && (role.toLowerCase() === 'manager' || role.toLowerCase() === 'director'));
            })
            .catch(() => { });
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            await apiFetch(`/api/organization${view ? `?view=${view}` : ""}`)
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
    }, [view]);

    return (
        <div className="p-2 sm:p-4 bg-base-100 flex-1 flex flex-col rounded-lg">

            <div className="flex flex-col sm:flex-row justify-end gap-2 p-2 mb-4 bg-base-200">
                {/* Actions */}
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
                ) : (
                    <table className="table w-full text-sm border-collapse rounded-lg min-w-[700px]">
                        <thead className="bg-[#eef3ff] text-gray-600">
                            <tr >

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
                            {data.map((row, i) => (
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

            <div className="flex flex-wrap justify-between items-center gap-3 mt-auto pt-2 text-sm">

                <div className="flex flex-wrap gap-2 sm:gap-8 items-center px-1">
                    <button className="text-gray-400">Prev</button>

                    <button className="bg-blue-900 text-white px-3 py-1 rounded">
                        1
                    </button>

                    <button>2</button>
                    <button>3</button>
                    <button>4</button>

                    <button>Next</button>
                </div>

                <div className="bg-[#eef3ff] p-2 sm:py-2 sm:px-5 rounded-lg">
                    Page Size
                    <select className="ml-2 border rounded px-2 py-1">
                        <option>10</option>
                        <option>25</option>
                        <option>50</option>
                    </select>
                </div>

            </div>


        </div>
    );
};

export default Table;