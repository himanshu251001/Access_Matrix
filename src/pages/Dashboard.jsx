// pages/Dashboard.jsx
import { useUser } from "../context/UserContext";

export default function Dashboard() {
  const { user,loading } = useUser();

  if (loading) {
    return (
        <div className="flex justify-center items-center h-48">
            <span className="loading loading-spinner text-primary loading-lg"></span>
        </div>
    );
  }

  return (
    <>
      <div className="bg-base-100 rounded-xl p-6 flex items-center gap-5 shadow-sm">
        <div className="w-14 h-14 rounded-full bg-blue-700 text-white flex items-center justify-center text-2xl font-bold shrink-0">
          {user?.full_name?.charAt(0).toUpperCase() || "?"}
        </div>
        <div>
          <h2 className="text-xl font-bold">{user?.full_name || "—"}</h2>
          <div className="flex flex-col gap-1 mt-1 text-sm text-base-content/60">
            <div>
              <span className="font-medium text-base-content">Department: </span>
              {user?.department || "—"}
            </div>
            <div>
              <span className="font-medium text-base-content">Grade: </span>
              {user?.grade || "—"}
            </div>
            <div>
              <span className="font-medium text-base-content">Role: </span>
              {user?.role?.toUpperCase() || "—"}
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
}
