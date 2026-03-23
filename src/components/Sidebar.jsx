import {
  User, X, Users, Building2
} from "lucide-react";
import SidebarItem from "./SidebarItem";

import React, { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";
import { useUser } from "../context/UserContext";

export default function Sidebar({ bgColor = "bg-base-300", isOpen, onClose }) {
  const [views, setViews] = useState([]);
  const [department, setDepartment] = useState("");
  const { user } = useUser();

  useEffect(() => {
    const fetchViews = async () => {
      try {
        const res = await apiFetch("/api/employee/views");
        if (!res || !res.ok) throw new Error("Failed to fetch views");
        const response = await res.json();

        setViews(Array.isArray(response.data.views) ? response.data.views : []);
        if (response.data.department) setDepartment(response.data.department);
      } catch {
        setViews(["employee"]);
      }
    };
    fetchViews();
  }, []);
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 flex flex-col border border-base-200 rounded pt-2 ${bgColor}
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:static md:translate-x-0 md:w-auto md:min-h-screen
        `}
      >
        <button
          className="md:hidden absolute top-2 right-1 btn btn-ghost btn-sm btn-circle hover:bg-base-100"
          onClick={onClose}
        >
          <X size={18} />
        </button>

        <h2 className="text-2xl font-bold my-4 text-center">Access Matrix</h2>

        <ul className="menu gap-2 border-t-2 border-base-200 px-4 py-4 w-full">
          <SidebarItem icon={User} label="Dashboard" to="/dashboard" onClick={onClose} />
          <SidebarItem icon={Building2} label="Organization" to="/organization" onClick={onClose} />
          {views.includes("teams") && (
            <SidebarItem icon={Users} label="Teams" to="/teams" onClick={onClose} />
          )}
        </ul>

        <div className="mt-auto flex items-center gap-3 pt-4 p-2 border-t-2 border-base-200">
          <div className="avatar bg-primary text-primary-content rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
            {user?.full_name?.charAt(0).toUpperCase() || "?"}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate">{user?.full_name || "—"}</p>
            <p className="text-xs text-base-content/60 truncate">{user?.email || "—"}</p>
          </div>
        </div>
      </aside>
    </>
  );
}
