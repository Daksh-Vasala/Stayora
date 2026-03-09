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
} from "lucide-react";

function UserNavbar() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const [accountMenu, setAccountMenu] = useState(false);

  const containerRef = useRef(null);

  const links = [
    { id: "explore", label: "Explore", icon: Compass, path: "/user" },
    { id: "wishlist", label: "Wishlist", icon: Heart, path: "/wishlist" },
    { id: "bookings", label: "My Bookings", icon: BookOpen, path: "/bookings" },
    {
      id: "messages",
      label: "Messages",
      icon: MessageCircle,
      path: "/messages",
    },
  ];

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setMobileMenu(false);
        setMobileSearch(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div ref={containerRef}>
        <nav
          className="sticky top-0 z-50 bg-white border-b border-stone-200 px-4 md:px-6 h-16 flex items-center gap-3"
          role="navigation"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <NavLink
            to="/"
            className="flex items-center gap-2 shrink-0 no-underline"
            aria-label="Go to homepage"
          >
            <Home size={20} className="text-orange-500" />
            <span className="text-lg font-semibold text-stone-900">
              Stay<span className="text-orange-500 font-bold">ora</span>
            </span>
          </NavLink>

          {/* Desktop Search */}
          <div className="hidden md:flex items-center gap-2 bg-stone-100 border border-stone-200 rounded-full px-4 py-2 w-64 shrink-0 focus-within:border-orange-400">
            <Search size={14} className="text-stone-400 shrink-0" />
            <input
              className="bg-transparent outline-none text-sm text-stone-800 w-full"
              placeholder="Search destination..."
              aria-label="Search destination"
            />
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-4 ml-auto">
            {links.map(({ label, icon: Icon, path }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? "bg-orange-50 text-orange-500"
                      : "text-stone-500 hover:bg-stone-100"
                  }`
                }
              >
                <Icon size={14} />
                {label}
              </NavLink>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 ml-auto md:ml-0">
            {/* Mobile Search */}
            <button
              aria-label="Open search"
              onClick={() => {
                setMobileSearch(!mobileSearch);
                setMobileMenu(false);
              }}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-full border border-stone-200"
            >
              <Search className="text-stone-600" size={16} />
            </button>

            {/* Notifications */}
            <button
              aria-label="Notifications"
              className="relative w-9 h-9 flex items-center justify-center rounded-full border border-stone-200"
            >
              <Bell className="text-stone-600" size={16} />
              <span className="absolute  top-2 right-2 w-1 h-1 bg-orange-500 rounded-full"></span>
            </button>

            {/* Desktop CTA */}
            <NavLink
              to="/explore"
              className="hidden md:block bg-orange-500 text-white text-sm font-bold px-4 py-2 rounded-full"
            >
              Book a Stay
            </NavLink>

            {/* Avatar */}
            <button
              onClick={() => {
                setAccountMenu(!accountMenu);
                setMobileMenu(false);
                setMobileSearch(false);
              }}
              className="flex items-center justify-center h-8 bg-stone-100 border border-stone-200 rounded-full px-1 hover:bg-stone-200 transition"
            >
              <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
                JD
              </div>
              <ChevronDown className="text-stone-400 ml-1" size={15} />
            </button>

            {/* Mobile Menu */}
            <button
              aria-label="Open menu"
              onClick={() => {
                setMobileMenu(!mobileMenu);
                setMobileSearch(false);
              }}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-full border border-stone-200"
            >
              {mobileMenu ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>

        {/* Mobile Search */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            mobileSearch ? "max-h-24 border-b" : "max-h-0"
          } bg-white border-stone-200`}
        >
          <div className="px-4 py-3">
            <div className="flex items-center gap-2 bg-stone-100 rounded-full px-4 py-2">
              <Search size={14} />
              <input
                autoFocus
                className="bg-transparent outline-none text-sm w-full"
                placeholder="Search destination..."
              />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            mobileMenu ? "max-h-96 border-b" : "max-h-0"
          } bg-white border-stone-200`}
        >
          <div className="flex flex-col">
            {links.map(({ label, icon: Icon, path }) => (
              <NavLink
                key={path}
                to={path}
                onClick={() => setMobileMenu(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-6 py-3 text-left transition ${
                    isActive
                      ? "bg-orange-50 text-orange-500"
                      : "text-stone-700 hover:bg-stone-100"
                  }`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}

            <NavLink
              to="/explore"
              onClick={() => setMobileMenu(false)}
              className="mx-4 my-3 flex items-center justify-center gap-2 bg-orange-500 text-white font-semibold py-3 rounded-xl"
            >
              <Compass size={16} />
              Book a Stay
            </NavLink>
          </div>
        </div>
      </div>

      {accountMenu && (
        <div className="absolute right-6 top-16 w-64 bg-white border border-stone-200 rounded-2xl shadow-lg overflow-hidden z-50 animate-in fade-in zoom-in-95">
          {/* User Info */}
          <div className="px-4 py-3">
            <p className="font-semibold text-stone-900">John Doe</p>
            <p className="text-sm text-stone-500">john@email.com</p>
          </div>

          <div className="border-t" />

          {/* Menu Items */}
          <div className="flex flex-col">
            <NavLink
              to="/profile"
              className="px-4 py-3 text-sm hover:bg-stone-100"
              onClick={() => setAccountMenu(false)}
            >
              Profile
            </NavLink>

            <NavLink
              to="/settings"
              className="px-4 py-3 text-sm hover:bg-stone-100"
              onClick={() => setAccountMenu(false)}
            >
              Notification Settings
            </NavLink>

            <NavLink
              to="/host"
              className="px-4 py-3 text-sm hover:bg-stone-100"
              onClick={() => setAccountMenu(false)}
            >
              Become a Host
            </NavLink>
          </div>

          <div className="border-t" />

          {/* Logout */}
          <button className="flex items-center gap-2 px-4 py-3 text-red-500 hover:bg-red-50 w-full text-sm">
            Sign out
          </button>
        </div>
      )}

      {/* Bottom Mobile Navigation
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-stone-200 md:hidden flex justify-around py-2">
        {links.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex flex-col items-center text-xs ${
                isActive ? "text-orange-500" : "text-stone-500"
              }`
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </div> */}
    </>
  );
}

export default UserNavbar;
