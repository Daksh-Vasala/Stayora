import React, { useState } from 'react';
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
  Menu,
  Bell,
  Search,
  User,
  X,
  MapPin,
  Calendar
} from 'lucide-react';

const AdminSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile drawer state
  const [isCollapsed, setIsCollapsed] = useState(false); // Desktop collapse state
  const [activeTab, setActiveTab] = useState('Dashboard');

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { name: 'Users', icon: Users, path: '/admin/users' },
    { name: 'Listings', icon: Home, path: '/admin/listings' },
    { name: 'Financials', icon: DollarSign, path: '/admin/financials' },
    { name: 'Disputes', icon: ShieldAlert, path: '/admin/disputes' },
    { name: 'Messages', icon: MessageSquare, path: '/admin/messages' },
    { name: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  // Close sidebar when clicking outside on mobile
  const handleOverlayClick = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
      
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
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${isCollapsed ? 'w-20' : 'w-72'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-700 bg-slate-900">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-wide">Admin<span className="text-blue-400">Panel</span></span>
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
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1 scrollbar-hide">
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  setActiveTab(item.name);
                  setIsSidebarOpen(false); // Close mobile drawer on click
                }}
                className={`
                  w-full flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 group
                  ${activeTab === item.name 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                `}
              >
                <item.icon className={`w-5 h-5 shrink-0 ${activeTab === item.name ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
                {!isCollapsed && (
                  <span className="ml-3 whitespace-nowrap">{item.name}</span>
                )}
                {activeTab === item.name && !isCollapsed && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
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
            <button className="mt-4 w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors border border-red-500/20">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </button>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Top Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm z-10">
          <div className="flex items-center">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="mr-4 text-gray-500 hover:text-gray-700 focus:outline-none md:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            {/* Search Bar */}
            <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 w-64">
              <Search className="w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search users, listings..." 
                className="bg-transparent border-none outline-none focus:ring-0 text-sm ml-2 w-full text-gray-700 placeholder-gray-400"
              />
            </div>
            
            <h1 className="text-xl font-bold text-gray-800 ml-4 hidden sm:block">
              {activeTab} Overview
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
            <div className="flex items-center space-x-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">admin@platform.com</p>
              </div>
              <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center border border-gray-300">
                <User className="w-5 h-5 text-gray-500" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Scroll Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Users', value: '12,345', change: '+12%', icon: Users, color: 'blue' },
                { label: 'Active Listings', value: '856', change: '+5%', icon: Home, color: 'green' },
                { label: 'Total Revenue', value: '$45,231', change: '+18%', icon: DollarSign, color: 'purple' },
                { label: 'Pending Disputes', value: '12', change: '-2%', icon: ShieldAlert, color: 'red' },
              ].map((stat, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-lg bg-${stat.color}-50 text-${stat.color}-600`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <span className={`font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
                    <span className="text-gray-400 ml-2">from last month</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activity Table Placeholder */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Recent Bookings</h3>
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                  <thead className="bg-gray-50 text-gray-900 font-medium">
                    <tr>
                      <th className="px-6 py-3">Guest</th>
                      <th className="px-6 py-3">Property</th>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[1, 2, 3, 4].map((item) => (
                      <tr key={item} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 flex items-center">
                          <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mr-3">
                            U{item}
                          </div>
                          <span className="font-medium text-gray-900">User {item}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                            <span>Villa Sunset {item}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">Oct {20 + item}, 2023</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item % 2 === 0 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {item % 2 === 0 ? 'Confirmed' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">$1,200</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminSidebar;