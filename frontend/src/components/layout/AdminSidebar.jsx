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
  NotepadText,
  Menu,
  X,
} from "lucide-react";

const AdminSidebar = ({ onLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
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
  ];

  const handleMobileMenuClick = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const handleCloseMobileMenu = () => {
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button - Fixed at top left */}
      <button
        onClick={handleMobileMenuClick}
        className="fixed top-2 left-2 z-50 md:hidden bg-zinc-900/50 text-white p-2.5 rounded-lg shadow-lg hover:bg-slate-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Toggle menu"
      >
        <Menu className="w-3 h-3" />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={handleCloseMobileMenu}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed md:relative z-50 h-full bg-slate-900 text-white flex flex-col transition-all duration-300 ease-in-out shadow-xl
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          ${isCollapsed ? "md:w-20" : "md:w-72"}
          w-72
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-700 bg-slate-900">
          {(!isCollapsed || isMobileOpen) && (
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-wide">
                Admin<span className="text-blue-400">Panel</span>
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            {/* Mobile close button */}
            <button
              onClick={handleCloseMobileMenu}
              className="md:hidden p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            {/* Desktop collapse button */}
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
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1 scrollbar-hide">
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  navigate(item.path);
                  setIsMobileOpen(false);
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
                  className={`w-5 h-5 shrink-0 ${
                    activeTab === item.name 
                      ? "text-white" 
                      : "text-slate-500 group-hover:text-white"
                  }`}
                />
                {(!isCollapsed || isMobileOpen) && (
                  <span className="ml-3 whitespace-nowrap">{item.name}</span>
                )}
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
            {(!isCollapsed || isMobileOpen) && (
              <div className="ml-3">
                <p className="text-sm font-medium text-white">Admin User</p>
                <p className="text-xs text-slate-400">Super Admin</p>
              </div>
            )}
            {(!isCollapsed || isMobileOpen) && (
              <button 
                onClick={() => {
                  navigate("/admin/settings");
                  setIsMobileOpen(false);
                }}
                className="ml-auto text-slate-400 hover:text-white transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
            )}
          </div>

          {(!isCollapsed || isMobileOpen) && (
            <button
              className="mt-4 w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors border border-red-500/20"
              onClick={() => {
                onLogout();
                setIsMobileOpen(false);
              }}
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