import React, { use, useState } from 'react';
import { Menu, Search as SearchIcon, Bell, LogOut, Users, X } from "lucide-react";
import { useUser } from "../context/UserContext";
import Search from "./UserSearch";
import SideDetailsPanel from "./SideDetailsPanel";
import { handleImpersonate, handleRevert, handleLogout } from "../services/UserServices";

const Topbar = ({ theme, setTheme, onMenuClick }) => {
  const { user, loading } = useUser();
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="flex items-center justify-between gap-2 px-4 sm:px-6 py-4 border-b border-base-200 bg-base-100">

      <div className="flex items-center gap-2 sm:gap-4">

        <button
          className="btn btn-ghost btn-sm btn-circle md:hidden"
          onClick={onMenuClick}
        >
          <Menu size={20} />
        </button>

        <h1 className="text-xl sm:text-3xl font-bold">Dashboard</h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">

        <div className="form-control hidden sm:flex border border-gray-300 rounded-md px-3 py-1">
          <Search 
            variant="input"
            icon={SearchIcon} 
            title="Search" 
            placeholder="Search..." 
            onAction={(u) => setSelectedUser(u)} 
          />
        </div>

        <button className="btn btn-ghost btn-circle">
          <Bell size={18} />
        </button>

        {!loading && user?.isAdmin && (
          <Search
            variant="button"
            icon={Users}
            title="Impersonate"
            placeholder="Search user to impersonate..."
            onAction={(u) => handleImpersonate(u.id, user)}
          />
        )}
        {!loading && user?.isImpersonation && (
          <button
            onClick={handleRevert}
            className="btn bg-base-100 btn-sm shadow-xs flex items-center gap-2 text-red-500 hover:bg-red-400 text-base-100/90 hover:text-white"
            title="Stop Impersonation">
            <X size={18} />
            <span className="hidden lg:inline">Stop Impersonation</span>
          </button>
        )}

        {!loading && !user?.isImpersonation && (
          <button
            onClick={handleLogout}
            className="btn bg-base-100 btn-sm shadow-xs flex items-center gap-2 text-red-500 hover:bg-red-400 text-base-100/90 hover:text-base-100"
            title="Logout"
          >
            <LogOut size={18} />
            <span className="hidden lg:inline">Logout</span>
          </button>
        )}
      </div>

      <SideDetailsPanel
        isOpen={!!selectedUser}
        data={selectedUser}
        columns={selectedUser ? Object.keys(selectedUser) : []}
        onClose={() => setSelectedUser(null)}
        isEditable={false}
      />
    </div >
  );
};


export default Topbar;
