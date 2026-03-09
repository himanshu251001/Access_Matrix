
import { X, Pencil } from "lucide-react";
export default function SideDetailsPanel({
    isOpen,
    data,
    columns,
    onClose,
    isEditable
}) {
    if (!isOpen || !data) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">

            <div
                className="absolute inset-0 bg-base-content/60"
                onClick={onClose}
            />

            <div className="relative w-4/5 md:w-2/5 lg:w-1/5 h-full bg-base-100 shadow-xl p-4 flex flex-col gap-3 overflow-y-auto border-l border-base-300">
                <div className="flex items-center justify-end gap-4">
                    {isEditable && (
                        <button
                            onClick={() => {/* Todo edit logic to be implemented here */ }}
                            className="btn btn-ghost btn-sm shadow-sm btn-circle  hover:bg-base-200 cursor-pointer"
                        >
                            <Pencil size={16} />
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="btn btn-ghost btn-sm shadow-sm btn-circle  hover:bg-base-200 cursor-pointer"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="flex items-center gap-3 pb-4 pr-2 ">
                    <div className="w-9 h-9 rounded-full  bg-[#064ffb] text-white flex items-center justify-center font-bold text-lg">
                        {(data.full_name || "?").charAt(0).toUpperCase()}
                    </div>
                    <h3 className="font-semibold text-base">{data.full_name}</h3>
                </div>


                <div className="border-t border-base-300 pt-3 flex flex-col gap-3">
                    {columns.map((col) => {
                        let value = data[col];

                        if (typeof value === "object" && value !== null)
                            value = JSON.stringify(value);
                        else if (value === null || value === undefined)
                            value = "—";

                        return (
                            <div key={col}>
                                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                                    {col.replace(/_/g, " ")}
                                </p>
                                <p className="text-sm font-medium mt-1 break-words">
                                    {value}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}