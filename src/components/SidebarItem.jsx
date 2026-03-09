import { NavLink, useLocation } from "react-router-dom";

const SidebarItem = ({ icon: Icon, label, to, onClick }) => {
  const location = useLocation();

  const currentPath = location.pathname + location.search;

  const isQueryMatch = currentPath === to;
  const isPathMatch = location.pathname === to;
  const isActive = to.includes("?") ? isQueryMatch : isPathMatch;

  return (
    <li>
      <NavLink
        to={to}
        onClick={onClick}
        className={() =>
          `flex gap-3 rounded-md px-8 py-3 text-sm font-medium transition-all ${isActive
            ? "bg-primary text-primary-content"
            : "hover:bg-base-200 hover:text-base-content"
          }`
        }
      >
        <Icon size={18} />
        {label}
      </NavLink>
    </li>
  );
};

export default SidebarItem;
