import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  Search,
  Bell,
  Heart,
  BookOpen,
  MessageCircle,
  Compass,
  Home,
  Menu,
  X,
  ChevronDown,
  User,
  Settings,
  LogOut,
  LayoutDashboard,
  Calendar,
  DollarSign,
  ShieldCheck,
} from "lucide-react";

function UserNavbar({ userRole = "host" }) {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const [accountMenu, setAccountMenu] = useState(false);

  const containerRef = useRef(null);

  // Guest-specific links
  const guestLinks = [
    { id: "explore", label: "Explore", icon: Compass, path: "/user" },
    { id: "wishlist", label: "Wishlist", icon: Heart, path: "/wishlist" },
    { id: "bookings", label: "My Bookings", icon: BookOpen, path: "/bookings" },
    { id: "messages", label: "Messages", icon: MessageCircle, path: "/messages" },
  ];

  // Host-specific links
  const hostLinks = [
    { id: "dashboard", label: "Host Dashboard", icon: LayoutDashboard, path: "/host/dashboard" },
    { id: "listings", label: "My Listings", icon: Home, path: "/host/listings" },
    { id: "calendar", label: "Calendar", icon: Calendar, path: "/host/calendar" },
    { id: "earnings", label: "Earnings", icon: DollarSign, path: "/host/earnings" },
    { id: "messages", label: "Messages", icon: MessageCircle, path: "/messages" },
  ];

  // Common links for both roles
  const commonLinks = [
    { id: "bookings", label: "My Bookings", icon: BookOpen, path: "/bookings" },
    { id: "messages", label: "Messages", icon: MessageCircle, path: "/messages" },
  ];

  // Determine which links to display based on role
  const displayLinks = userRole === "host" ? hostLinks : guestLinks;

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setMobileMenu(false);
        setMobileSearch(false);
        setAccountMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div ref={containerRef}>
        {/* Main Navbar */}
        <nav
          className="sticky top-0 z-50 bg-white border-b border-slate-200 px-4 md:px-6 h-16 flex items-center gap-3 shadow-sm"
          role="navigation"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <NavLink
            to="/"
            className="flex items-center gap-2 shrink-0 no-underline"
            aria-label="Go to homepage"
          >
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Home size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">
              Stay<span className="text-blue-600">ora</span>
            </span>
          </NavLink>

          {/* Desktop Search */}
          <div className="hidden md:flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-full px-4 py-2 w-96 shrink-0 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <Search size={16} className="text-slate-400 shrink-0" />
            <input
              className="bg-transparent outline-none text-sm text-slate-800 w-full placeholder-slate-400"
              placeholder="Search destination, property type..."
              aria-label="Search destination"
            />
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2 ml-auto">
            {displayLinks.map(({ label, icon: Icon, path }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-blue-50 text-blue-600 shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 ml-auto md:ml-0">
            {/* Mobile Search Toggle */}
            <button
              aria-label="Open search"
              onClick={() => {
                setMobileSearch(!mobileSearch);
                setMobileMenu(false);
              }}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-full border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <Search className="text-slate-600" size={18} />
            </button>

            {/* Notifications */}
            <button
              aria-label="Notifications"
              className="relative w-9 h-9 flex items-center justify-center rounded-full border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <Bell className="text-slate-600" size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>

            {/* Desktop CTA */}
            <NavLink
              to={userRole === "host" ? "/host/dashboard" : "/explore"}
              className="hidden md:block bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-blue-700 transition-colors shadow-sm"
            >
              {userRole === "host" ? "Host Dashboard" : "Host a Property"}
            </NavLink>

            {/* Avatar */}
            <button
              onClick={() => {
                setAccountMenu(!accountMenu);
                setMobileMenu(false);
                setMobileSearch(false);
              }}
              className="flex items-center justify-center h-9 bg-slate-100 border border-slate-200 rounded-full px-2 hover:bg-slate-200 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                JD
              </div>
              <ChevronDown className="text-slate-500 ml-1" size={14} />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              aria-label="Open menu"
              onClick={() => {
                setMobileMenu(!mobileMenu);
                setMobileSearch(false);
                setAccountMenu(false);
              }}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-full border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              {mobileMenu ? <X size={20} className="text-slate-600" /> : <Menu size={20} className="text-slate-600" />}
            </button>
          </div>
        </nav>

        {/* Mobile Search Bar */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileSearch ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
          } bg-white border-b border-slate-200`}
        >
          <div className="px-4 py-3">
            <div className="flex items-center gap-2 bg-slate-100 rounded-full px-4 py-2.5 border border-slate-200">
              <Search size={16} className="text-slate-400" />
              <input
                autoFocus
                className="bg-transparent outline-none text-sm w-full placeholder-slate-400"
                placeholder="Search destination..."
              />
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenu ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          } bg-white border-b border-slate-200`}
        >
          <div className="flex flex-col p-2">
            {displayLinks.map(({ label, icon: Icon, path }) => (
              <NavLink
                key={path}
                to={path}
                onClick={() => setMobileMenu(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                    isActive
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`
                }
              >
                <Icon size={20} />
                {label}
              </NavLink>
            ))}

            <div className="my-2 border-t border-slate-100" />

            <NavLink
              to={userRole === "host" ? "/host/dashboard" : "/explore"}
              onClick={() => setMobileMenu(false)}
              className="mx-2 flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3.5 rounded-xl shadow-sm hover:bg-blue-700 transition-colors"
            >
              {userRole === "host" ? (
                <LayoutDashboard size={18} />
              ) : (
                <Compass size={18} />
              )}
              {userRole === "host" ? "Host Dashboard" : "Host a Property"}
            </NavLink>
          </div>
        </div>
      </div>

      {/* Account Dropdown */}
      {accountMenu && (
        <div className="absolute right-6 top-16 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
          {/* User Info Header */}
          <div className="px-5 py-4 bg-slate-50 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
                JD
              </div>
              <div>
                <p className="font-bold text-slate-900">John Doe</p>
                <p className="text-xs text-slate-500">
                  {userRole === "host" ? "Host" : "Guest"} • Verified
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="flex flex-col p-2">
            {/* Host-specific links */}
            {userRole === "host" && (
              <>
                <NavLink
                  to="/host/dashboard"
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  onClick={() => setAccountMenu(false)}
                >
                  <LayoutDashboard size={18} className="text-slate-400" />
                  Host Dashboard
                </NavLink>
                <NavLink
                  to="/host/listings"
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  onClick={() => setAccountMenu(false)}
                >
                  <Home size={18} className="text-slate-400" />
                  My Listings
                </NavLink>
                <NavLink
                  to="/host/earnings"
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  onClick={() => setAccountMenu(false)}
                >
                  <DollarSign size={18} className="text-slate-400" />
                  Earnings & Payouts
                </NavLink>
                <div className="my-2 border-t border-slate-100" />
              </>
            )}

            {/* Common links */}
            <NavLink
              to="/profile"
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors"
              onClick={() => setAccountMenu(false)}
            >
              <User size={18} className="text-slate-400" />
              Profile Settings
            </NavLink>
            <NavLink
              to="/bookings"
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors"
              onClick={() => setAccountMenu(false)}
            >
              <BookOpen size={18} className="text-slate-400" />
              My Bookings
            </NavLink>
            <NavLink
              to="/messages"
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors"
              onClick={() => setAccountMenu(false)}
            >
              <MessageCircle size={18} className="text-slate-400" />
              Messages
            </NavLink>

            {userRole === "guest" && (
              <>
                <div className="my-2 border-t border-slate-100" />
                <NavLink
                  to="/wishlist"
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  onClick={() => setAccountMenu(false)}
                >
                  <Heart size={18} className="text-slate-400" />
                  Wishlist
                </NavLink>
              </>
            )}

            <div className="my-2 border-t border-slate-100" />

            <NavLink
              to="/settings"
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors"
              onClick={() => setAccountMenu(false)}
            >
              <Settings size={18} className="text-slate-400" />
              Account Settings
            </NavLink>

            <div className="my-2 border-t border-slate-100" />

            <button className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors">
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default UserNavbar;