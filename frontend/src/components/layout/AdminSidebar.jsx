import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Home,
  DollarSign,
  MessageSquare,
  Settings,
  ShieldAlert,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  NotepadText,
} from "lucide-react";

const AdminSidebar = ({ onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile drawer state
  const [isCollapsed, setIsCollapsed] = useState(false); // Desktop collapse state
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = (pathname) => {
    if (pathname === "/admin") return "Dashboard";
    const pathMap = {
      "/admin/users": "Users",
      "/admin/listings": "Listings",
      "/admin/bookings": "Bookings",
      "/admin/financials": "Financials",
      "/admin/disputes": "Disputes",
      "/admin/messages": "Messages",
      "/admin/settings": "Settings",
    };
    return pathMap[pathname] || "Dashboard";
  };

  const activeTab = getActiveTab(location.pathname);
  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin" },
    { name: "Users", icon: Users, path: "/admin/users" },
    { name: "Listings", icon: Home, path: "/admin/listings" },
    { name: "Bookings", icon: NotepadText, path: "/admin/bookings" },
    { name: "Financials", icon: DollarSign, path: "/admin/financials" },
    { name: "Disputes", icon: ShieldAlert, path: "/admin/disputes" },
    { name: "Messages", icon: MessageSquare, path: "/admin/messages" },
    { name: "Settings", icon: Settings, path: "/admin/settings" },
  ];

  // Close sidebar when clicking outside on mobile
  const handleOverlayClick = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm transition-opacity"
          onClick={handleOverlayClick}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed md:relative z-30 h-full bg-slate-900 text-white flex flex-col transition-all duration-300 ease-in-out shadow-xl
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${isCollapsed ? "w-20" : "w-72"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-700 bg-slate-900">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-wide">
                Admin<span className="text-blue-400">Panel</span>
              </span>
            </div>
          )}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-1 rounded hover:bg-slate-800 text-slate-400"
          >
            <X className="w-6 h-6" />
          </button>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:block p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1 scrollbar-hide">
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  navigate(item.path);
                  setIsSidebarOpen(false); // Close mobile drawer on click
                }}
                className={`
                  w-full flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 group
                  ${
                    activeTab === item.name
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }
                `}
              >
                <item.icon
                  className={`w-5 h-5 shrink-0 ${activeTab === item.name ? "text-white" : "text-slate-500 group-hover:text-white"}`}
                />
                {!isCollapsed && (
                  <span className="ml-3 whitespace-nowrap">{item.name}</span>
                )}
                {/* {activeTab === item.name && !isCollapsed && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )} */}
              </button>
            ))}
          </nav>
        </div>

        {/* Footer / User Profile */}
        <div className="p-4 border-t border-slate-700 bg-slate-900/50">
          <div className="flex items-center">
            <div className="relative">
              <div className="h-10 w-10 rounded-full bg-linear-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg">
                A
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></div>
            </div>
            {!isCollapsed && (
              <div className="ml-3">
                <p className="text-sm font-medium text-white">Admin User</p>
                <p className="text-xs text-slate-400">Super Admin</p>
              </div>
            )}
            {!isCollapsed && (
              <button className="ml-auto text-slate-400 hover:text-white">
                <Settings className="w-5 h-5" />
              </button>
            )}
          </div>

          {!isCollapsed && (
            <button
              className="mt-4 w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors border border-red-500/20"
              onClick={onLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
