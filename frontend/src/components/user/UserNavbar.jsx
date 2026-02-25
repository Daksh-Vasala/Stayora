import { Link, NavLink, Outlet } from "react-router-dom";
import { useState } from "react";

function UserNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navLinkStyle = ({ isActive }) =>
    `
    border-b-2 border-transparent
    ${isActive
      ? "text-indigo-600 font-semibold"
      : "hover:text-indigo-600 hover:border-indigo-600 transition-colors duration-200"
    }
    `

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-zinc-400 shadow-sm">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          
          {/* Logo */}
          <Link
            to="/"
            className="text-xl sm:text-2xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-wide"
          >
            Stayora
          </Link>

          <div className="flex gap-5">
            <div className="hidden md:flex items-center space-x-6 text-gray-700 text-sm font-medium">
              <NavLink to="/explore" className={navLinkStyle}>
                Explore
              </NavLink>
              <NavLink to="/trips" className={navLinkStyle}>
                Trips
              </NavLink>
              <NavLink to="/wishlist" className={navLinkStyle}>
                Wishlist
              </NavLink>
            </div>

            {/* Right Section */}
            <div className="hidden md:flex items-center space-x-4">
              
              <Link
                to="/become-host"
                className="text-sm px-4 py-1.5 rounded-full border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all duration-200"
              >
                Become a Host
              </Link>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center border border-gray-200 px-3 py-1.5 rounded-full hover:shadow-md hover:border-indigo-500 transition-all duration-200"
                >
                  <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-semibold">
                    U
                  </div>
                </button>

                {/* Animated Dropdown */}
                <div
                  className={`absolute right-0 mt-3 w-56 bg-white border rounded-xl shadow-lg py-2 text-sm transform transition-all duration-200 origin-top ${
                    profileOpen
                      ? "opacity-100 scale-100 visible"
                      : "opacity-0 scale-95 invisible"
                  }`}
                >
                  <NavLink to="/profile" className="block px-4 py-2 hover:bg-gray-100">
                    Profile
                  </NavLink>
                  <NavLink to="/bookings" className="block px-4 py-2 hover:bg-gray-100">
                    Bookings
                  </NavLink>
                  <NavLink to="/reviews" className="block px-4 py-2 hover:bg-gray-100">
                    Reviews
                  </NavLink>
                  <NavLink to="/settings" className="block px-4 py-2 hover:bg-gray-100">
                    Settings
                  </NavLink>
                  <div className="border-t my-2"></div>
                  <button className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50">
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Desktop Menu */}

          {/* Mobile Button */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Animated Mobile Menu */}
        <div
          className={`md:hidden bg-white border-t overflow-hidden transition-all duration-300 ${
            menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 py-4 space-y-4 text-sm font-medium">
            <NavLink to="/explore" className="block">
              Explore
            </NavLink>
            <NavLink to="/trips" className="block">
              Trips
            </NavLink>
            <NavLink to="/wishlist" className="block">
              Wishlist
            </NavLink>
            <NavLink to="/messages" className="block">
              Messages
            </NavLink>
            <NavLink to="/profile" className="block">
              Profile
            </NavLink>
            <button className="block text-red-500">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="min-h-screen bg-gray-50">
        <Outlet />
      </div>
    </>
  );
}

export default UserNavbar;