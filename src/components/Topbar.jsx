import React, { useState, useEffect, useRef } from 'react';
import { Menu, Search, Bell, LogOut, Users, X } from "lucide-react";
import { setAccessToken } from "../auth";
import { logout } from "../auth";
import { apiFetch } from "../utils/api";
import { useUser } from "../context/UserContext";
const Topbar = ({ theme, setTheme, onMenuClick }) => {
  const { user, loading } = useUser();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const searchRef = useRef(null);

  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setShowSearch(false);
      setSearchQuery("");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.length < 3) {
      setSearchResults([]);
      setLoadingUsers(false);
      return;
    }
    setLoadingUsers(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await apiFetch(`/api/employee/search?value=${encodeURIComponent(searchQuery)}`);
        if (res && res.ok) {
          const response = await res.json();
          setSearchResults(response.data || []);
        }
      } catch (error) {
        console.error("Error fetching users for impersonation:", error);
      } finally {
        setLoadingUsers(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleImpersonate = async (userId) => {
    if (userId === user?.id) {
      alert("You cannot impersonate yourself.");
      return;
    }
    try {
      const res = await apiFetch("/auth/impersonate", {
        method: "POST",
        body: JSON.stringify({ targetUserId: userId }),
      });
      if (res && res.ok) {
        const data = await res.json();
        if (data.accessToken) {
          setAccessToken(data.accessToken);
          setShowSearch(false);
          setSearchQuery("");
          window.location.reload();
        }
      } else {
        alert("Failed to impersonate user. Ensure you have the right privileges.");
      }
    } catch (err) {
      console.error(err);
      alert("Error impersonating user.");
    }
  };

  const handleRevert = async () => {
    const res = await apiFetch("/auth/stopImpersonation", {
      method: "POST",
    });
    if (res && res.ok) {
      const data = await res.json();
      setAccessToken(data.accessToken);
      window.location.reload();
    } else {
      alert("Failed to revert impersonation.");
    }
  };
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

        <div className="form-control hidden sm:flex">
          <div className="input input-bordered flex items-center gap-2">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search"
              className="grow focus:ring-gray-400"
            />
          </div>
        </div>

        <button className="btn btn-ghost btn-circle">
          <Bell size={18} />
        </button>

        {!loading && user?.isAdmin &&
          (
            <div className="relative" ref={searchRef} >
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="btn btn-ghost btn-circle text-primary"
                title="Impersonate"
              >
                <Users size={18} />
              </button>

              {showSearch && (
                <div className="absolute right-0 mt-2 w-64 bg-base-100 border border-base-200 shadow-lg rounded-md z-50">
                  <div className="p-2 border-b border-base-200">
                    <input
                      type="text"
                      placeholder="Search user to impersonate..."
                      className="input input-bordered input-sm w-full"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <ul className="max-h-60 overflow-y-auto ">
                    {searchResults.filter((u) => u.id !== user?.id).map((user) => (
                      <li key={user.id} className="w-full">
                        <button
                          className="w-full text-left px-4 py-3 text-sm hover:bg-primary hover:text-base-100 rounded-md my-0.5"
                          onClick={() => handleImpersonate(user.id)}
                        >
                          <div className="flex items-center w-full">
                            <span className="w-8 text-left ">{user.id}</span>
                            <span className="text-base-content/40 mr-2 ">|</span>
                            <span className="font-medium flex-1 truncate">{user.full_name}</span>
                          </div>
                        </button>
                      </li>
                    ))}
                    {loadingUsers && (
                      <li className="px-4 py-2 text-sm text-gray-500 text-center">
                        <span className="loading loading-spinner loading-sm"></span>
                      </li>
                    )}
                    {!loadingUsers && searchQuery.length > 2 && searchResults.filter((u) => u.id !== user?.id).length === 0 && (
                      <li className="px-4 py-2 text-sm text-gray-500 text-center">No users found.</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          )
        }
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
            onClick={logout}
            className="btn bg-base-100 btn-sm shadow-xs flex items-center gap-2 text-red-500 hover:bg-red-400 text-base-100/90 hover:text-base-100"
            title="Logout"
          >
            <LogOut size={18} />
            <span className="hidden lg:inline">Logout</span>
          </button>
        )}
      </div>
    </div >
  );
};


export default Topbar;
