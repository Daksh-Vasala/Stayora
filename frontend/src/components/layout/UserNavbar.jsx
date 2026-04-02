import { useState, useMemo } from "react";
import { NavLink } from "react-router-dom";
import {
  Bell,
  Heart,
  BookOpen,
  MessageCircle,
  Compass,
  Home,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  User,
  Settings,
  LogOut,
  LayoutDashboard,
  Calendar,
  DollarSign,
} from "lucide-react";

function UserNavbar({ userRole, onLogout }) {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [accountMenu, setAccountMenu] = useState(false);

  /* ---------------- NAV LINKS ---------------- */

  const guestLinks = [
    { label: "Explore", icon: Compass, path: "/" },
    { label: "My Bookings", icon: BookOpen, path: "/bookings" },
    { label: "Messages", icon: MessageCircle, path: "/messages" },
  ];

  const hostLinks = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/host" },
    { label: "Listings", icon: Home, path: "/host/listings" },
    { label: "Bookings", icon: Calendar, path: "/host/bookings" },
    { label: "Earnings", icon: DollarSign, path: "/host/earnings" },
    { label: "Messages", icon: MessageCircle, path: "/messages" },
  ];

  const adminLinks = [
    { label: "Admin Dashboard", icon: LayoutDashboard, path: "/admin" },
  ];

  const publicLinks = [{ label: "Explore", icon: Compass, path: "/" }];

  const displayLinks = useMemo(() => {
    if (!userRole) return publicLinks;
    if (userRole === "host") return hostLinks;
    if (userRole === "admin") return adminLinks;
    return guestLinks;
  }, [userRole]);

  return (
    <div className="relative">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 px-4 md:px-6 h-16 flex items-center shadow-sm">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Home size={18} className="text-white" />
          </div>
          <span className="text-lg font-bold text-slate-900">
            Stay<span className="text-blue-600">ora</span>
          </span>
        </NavLink>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-2 ml-auto">
          {displayLinks.map(({ label, icon: Icon, path }) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/host"} // ⭐ important fix
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
              onClick={() => {
                setAccountMenu(false);
                setMobileMenu(false);
              }}
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 ml-auto md:ml-2">
          {/* Notifications */}
          {userRole && (
            <button className="relative w-9 h-9 flex items-center justify-center rounded-full border border-slate-200 hover:bg-slate-50">
              <Bell size={18} className="text-slate-600" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          )}

          {/* Guest CTA */}
          {userRole === "guest" && (
            <NavLink
              to="/host/become-host"
              className="hidden md:block bg-blue-600 text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-blue-700"
            >
              Become a Host
            </NavLink>
          )}

          {/* Public */}
          {!userRole && (
            <>
              <NavLink
                to="/login"
                className="text-sm font-medium text-slate-700 px-4 py-2 hover:text-blue-600"
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                className="bg-blue-600 text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-blue-700"
              >
                Sign up
              </NavLink>
            </>
          )}

          {/* Avatar */}
          {userRole && (
            <button
              onClick={() => {
                setAccountMenu((prev) => !prev);
                setMobileMenu(false);
              }}
              className="flex items-center bg-slate-100 border border-slate-200 rounded-full px-2 h-9"
            >
              <div className="w-7 h-7 rounded-full bg-linear-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                JD
              </div>

              {accountMenu ? (
                <ChevronUp className="ml-1 text-slate-500" size={14} />
              ) : (
                <ChevronDown className="ml-1 text-slate-500" size={14} />
              )}
            </button>
          )}

          {/* Mobile Toggle */}
          <button
            onClick={() => {
              setMobileMenu((prev) => !prev);
              setAccountMenu(false);
            }}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-full border border-slate-200"
          >
            {mobileMenu ? (
              <X size={20} className="text-slate-600" />
            ) : (
              <Menu size={20} className="text-slate-600" />
            )}
          </button>
        </div>
      </nav>

      {/* ACCOUNT DROPDOWN */}
      {accountMenu && userRole && (
        <div className="absolute right-6 top-full mt-2 z-50 w-64 bg-white border border-slate-200 rounded-xl shadow-lg p-2">
          <NavLink
            to="/profile"
            onClick={() => setAccountMenu(false)}
            className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-slate-50 rounded"
          >
            <User size={18} />
            Profile
          </NavLink>

          <NavLink
            to="/settings"
            onClick={() => setAccountMenu(false)}
            className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-slate-50 rounded"
          >
            <Settings size={18} />
            Settings
          </NavLink>

          <div className="border-t my-2"></div>

          <button
            onClick={() => {
              setAccountMenu(false);
              onLogout();
            }}
            className="flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded w-full"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      )}

      {/* MOBILE MENU */}
      {mobileMenu && (
        <div className="md:hidden bg-white border-b border-slate-200">
          <div className="flex flex-col p-2">
            {displayLinks.map(({ label, icon: Icon, path }) => (
              <NavLink
                key={path}
                to={path}
                onClick={() => setMobileMenu(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50"
              >
                <Icon size={20} />
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default UserNavbar;
