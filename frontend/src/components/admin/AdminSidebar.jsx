import {
  BookOpen,
  MessageCircle,
  Home,
  Star,
  LayoutDashboard,
  Users,
  List,
  ShieldAlert,
  DollarSign,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  FileText,
  Menu
} from "lucide-react";

import { useState } from "react";

const adminNav = [
  {
    section: "Overview",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "reports", label: "Reports", icon: FileText },
    ],
  },
  {
    section: "Management",
    items: [
      { id: "users", label: "Users", icon: Users, badge: "1.2k" },
      { id: "listings", label: "Listings", icon: List, badge: "340" },
      { id: "bookings", label: "Bookings", icon: BookOpen },
      { id: "payments", label: "Payments", icon: DollarSign },
    ],
  },
  {
    section: "Support",
    items: [
      {
        id: "disputes",
        label: "Disputes",
        icon: ShieldAlert,
        badge: "7",
        alert: true,
      },
      {
        id: "messages",
        label: "Messages",
        icon: MessageCircle,
        badge: "12",
        alert: true,
      },
      { id: "reviews", label: "Reviews", icon: Star },
    ],
  },
  {
    section: "System",
    items: [{ id: "settings", label: "Settings", icon: Settings }],
  },
];

function AdminSidebar({
  collapsed,
  setCollapsed,
  active,
  setActive,
  // mobileOpen,
  // setMobileOpen,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <>
      <button onClick={() => setMobileOpen(true)} className="md:hidden p-2">
        <Menu size={20} />
      </button>
      <aside
        className={`fixed left-0 top-0 h-screen bg-[#13111A] border-r border-[#1F1B2E] flex flex-col z-50 transition-all duration-200 overflow-hidden
        ${collapsed ? "w-15" : "w-57.5"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
      >
        {/* Logo row */}
        <div
          className={`flex items-center h-16 px-3.5 border-b border-[#1F1B2E] shrink-0 gap-2 ${collapsed ? "justify-center" : "justify-between"}`}
        >
          {!collapsed && (
            <a href="/" className="flex items-center gap-2 no-underline">
              <Home size={18} className="text-violet-400" />
              <span className="text-white font-semibold text-[17px]">
                Stay<span className="text-violet-400 font-bold">ora</span>
              </span>
            </a>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#1F1B2E] hover:bg-[#2D2841] text-stone-500 hover:text-white transition-colors cursor-pointer border-none shrink-0"
          >
            {collapsed ? (
              <PanelLeftOpen size={14} />
            ) : (
              <PanelLeftClose size={14} />
            )}
          </button>
        </div>

        {/* Nav sections */}
        <nav className="flex-1 overflow-y-auto p-2 [scrollbar-width:none]">
          {adminNav.map(({ section, items }) => (
            <div key={section} className="mb-1">
              {!collapsed ? (
                <p className="text-[10px] font-bold text-stone-600 uppercase tracking-widest px-2.5 pt-3 pb-1">
                  {section}
                </p>
              ) : (
                <div className="h-px bg-[#1F1B2E] my-2 mx-1" />
              )}

              {items.map(({ id, label, icon: Icon, badge, alert }) => (
                <button
                  key={id}
                  onClick={() => {
                    setActive(id);
                    setMobileOpen(false);
                  }}
                  title={collapsed ? label : undefined}
                  className={`relative flex items-center gap-2.5 w-full rounded-lg text-sm transition-all cursor-pointer border-none mb-0.5
                    ${collapsed ? "justify-center px-0 py-2.5" : "px-2.5 py-2"}
                    ${
                      active === id
                        ? "bg-violet-500/10 text-violet-400 font-semibold"
                        : "bg-transparent text-stone-400 font-normal hover:bg-white/5 hover:text-stone-200"
                    }`}
                >
                  {active === id && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-violet-500 rounded-r" />
                  )}

                  <Icon size={16} className="shrink-0" />

                  {!collapsed && (
                    <span className="whitespace-nowrap">{label}</span>
                  )}

                  {!collapsed && badge && (
                    <span
                      className={`ml-auto text-[11px] font-semibold px-2 py-0.5 rounded-full
                      ${alert ? "bg-red-500/10 text-red-400" : "bg-white/10 text-stone-400"}`}
                    >
                      {badge}
                    </span>
                  )}

                  {collapsed && alert && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#13111A]" />
                  )}
                </button>
              ))}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-2 border-t border-[#1F1B2E] shrink-0">
          <button
            className={`flex items-center gap-2.5 w-full rounded-lg py-2.5 text-sm text-stone-500 hover:text-red-400 transition-colors cursor-pointer border-none bg-transparent
              ${collapsed ? "justify-center px-0" : "px-2.5"}`}
          >
            <LogOut size={16} className="shrink-0" />
            {!collapsed && <span>Sign out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;
