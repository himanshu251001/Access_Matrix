
import { Menu, Search, Bell, LogOut } from "lucide-react";
import { logout } from "../auth";

const Topbar = ({ theme, setTheme, onMenuClick }) => {
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


        <button
          onClick={logout}
          className="btn bg-base-100 btn-md shadow-xs flex items-center gap-2 text-red-500 hover:bg-red-400 text-base-100/90 hover:text-white"
          title="Logout"
        >
          <LogOut size={18} />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </div>
  );
};


export default Topbar;
