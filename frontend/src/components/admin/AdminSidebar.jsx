import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const linkStyle = ({ isActive }) =>
    `block px-4 py-2 rounded-lg transition ${
      isActive
        ? "bg-indigo-600 text-white"
        : "hover:bg-slate-800 text-gray-300"
    }`;

  return (
    <div className="flex min-h-screen bg-gray-100 relative">

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static z-50 top-0 left-0 min-h-full w-64 bg-slate-900 text-white
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="flex flex-col h-full p-5">

          {/* Logo */}
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-xl font-bold tracking-wide">
              Stayora Admin
            </h2>

            {/* Close button (mobile only) */}
            <button
              className="md:hidden text-xl"
              onClick={() => setSidebarOpen(false)}
            >
              ✕
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 text-sm font-medium">
            <NavLink to="/admin/dashboard" className={linkStyle}>
              Dashboard
            </NavLink>
            <NavLink to="/admin/properties" className={linkStyle}>
              Properties
            </NavLink>
            <NavLink to="/admin/bookings" className={linkStyle}>
              Bookings
            </NavLink>
            <NavLink to="/admin/users" className={linkStyle}>
              Users
            </NavLink>
            <NavLink to="/admin/payments" className={linkStyle}>
              Payments
            </NavLink>
            <NavLink to="/admin/reports" className={linkStyle}>
              Reports
            </NavLink>
            <NavLink to="/admin/disputes" className={linkStyle}>
              Disputes
            </NavLink>
            <NavLink to="/admin/settings" className={linkStyle}>
              Settings
            </NavLink>
          </nav>

          {/* Logout */}
          <button className="mt-auto bg-red-500 hover:bg-red-600 transition py-2 rounded-lg font-semibold">
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        {/* Top Bar (Mobile Header) */}
        <header className="md:hidden bg-white shadow px-4 py-3 flex items-center justify-between">
          <button
            className="text-2xl"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
          <h1 className="font-semibold">Admin Panel</h1>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;