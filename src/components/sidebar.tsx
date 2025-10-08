import { Menu, X, Users, BarChart2, Settings, Home } from "lucide-react";
import { useState } from "react";
function Sidebar() {
      const [sidebarOpen, setSidebarOpen] = useState(true);
    return (
        <div className="flex h-screen bg-gray-100">
            <aside
                className={`${sidebarOpen ? "w-64" : "w-20"
                    } bg-white shadow-md transition-all duration-300`}
            >
                <div className="flex items-center justify-between p-4">
                    <h1 className="text-xl text-amber-800 font-bold">{sidebarOpen ? "My Dashboard" : "MD"}</h1>
                    <button onClick={() => setSidebarOpen(!sidebarOpen)}>
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
                <nav className="mt-4">
                    <ul className="space-y-2">
                        <li className="flex items-center gap-3 p-2 hover:bg-gray-200 cursor-pointer">
                            <Home size={20} />
                            {sidebarOpen && <span><a href="/dashboard">Dashboard</a></span>}
                        </li>
                        <li className="flex items-center gap-3 p-2 hover:bg-gray-200 cursor-pointer">
                            <Users size={20} />
                            {sidebarOpen && <span><a href="#">Users</a></span>}
                        </li>
                        <li className="flex items-center gap-3 p-2 hover:bg-gray-200 cursor-pointer">
                            <BarChart2 size={20} />
                            {sidebarOpen && <span><a href="#">Reports</a></span>}
                        </li>
                        <li className="flex items-center gap-3 p-2 hover:bg-gray-200 cursor-pointer">
                            <Settings size={20} />
                            {sidebarOpen && <span><a href="#">Profile Settings</a></span>}
                        </li>
                    </ul>
                </nav>
            </aside>
        </div>
    )
}

export default Sidebar;