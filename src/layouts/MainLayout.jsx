import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { UserProvider } from "../context/UserContext";

export default function MainLayout({ theme, setTheme }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <UserProvider>
            <div className="flex min-h-screen bg-base-200">
                <Sidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />

                <div className="min-w-0 flex-1 flex flex-col ">
                    <Topbar
                        theme={theme}
                        setTheme={setTheme}
                        onMenuClick={() => setSidebarOpen(true)}
                    />

                    <main className="p-4 flex flex-col gap-4 sm:gap-6 flex-1">
                        <Outlet />
                    </main>
                </div>
            </div>
        </UserProvider>
    );
}
