import React, { useState, useEffect, useRef } from 'react';
import { apiFetch } from "../utils/api";
import { useUser } from "../context/UserContext";

const Search = ({
  onAction,
  icon: Icon,
  title,
  placeholder = "Search user...",
  btnClassName = "btn btn-ghost btn-circle text-primary",
  variant = "button",
}) => {
  const { user } = useUser();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const searchRef = useRef(null);

  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setShowSearch(false);
      if (variant === "button") {
        setSearchQuery("");
      }
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
        console.error("Error fetching users:", error);
      } finally {
        setLoadingUsers(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  return (
    <div className="relative" ref={searchRef}>
      {variant === "button" ? (
        <button
          onClick={() => setShowSearch(!showSearch)}
          className={btnClassName}
          title={title}
        >
          {Icon && <Icon size={18} />}
        </button>
      ) : (
        <div className="flex flex-1 items-center gap-2 ">
          {Icon && <Icon size={16} />}
          <input
            type="text"
            placeholder={placeholder}
            className={`bg-transparent outline-none w-full `}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (!showSearch && e.target.value.length >= 3) {
                setShowSearch(true);
              }
            }}
            onFocus={() => {
              if (searchQuery.length >= 3) setShowSearch(true);
            }}
          />
        </div>
      )}

      {showSearch && (
        <div className={`absolute mt-2 bg-base-100 border border-base-200 shadow-lg rounded-md z-50 ${
          variant === "button" ? "right-2 w-64" : "-right-3 w-full min-w-[230px]"
        }`}>
          {variant === "button" && (
            <div className="p-2 border-b border-base-200">
              <input
                type="text"
                placeholder={placeholder}
                className="input input-bordered input-sm w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}
          <ul className="max-h-60 overflow-y-auto ">
            {searchResults.filter((u) => u.id !== user?.id).map((usr) => (
              <li key={usr.id} className="w-full">
                <button
                  className="w-full text-left px-4 py-3 text-sm hover:bg-primary hover:text-base-100 rounded-md my-0.5"
                  onClick={() => {
                    onAction(usr);
                    setShowSearch(false);
                    if (variant === "button") {
                      setSearchQuery("");
                    }
                  }}
                >
                  <div className="flex items-center w-full">
                    <span className="w-8 text-left ">{usr.id}</span>
                    <span className="text-base-content/40 mr-2 ">|</span>
                    <span className="font-medium flex-1 truncate">{usr.full_name}</span>
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
  );
};

export default Search;
