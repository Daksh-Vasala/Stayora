// pages/AdminDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Home,
  Users,
  Calendar,
  DollarSign,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  MoreVertical,
  Search,
  Filter,
  Download,
  Settings,
  LogOut,
  Shield,
  Star,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProperties: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingApprovals: 0,
    activeListings: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [pendingProperties, setPendingProperties] = useState([]);
  const [selectedTab, setSelectedTab] = useState("overview");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, bookingsRes, propertiesRes] = await Promise.all([
        axios.get("/admin/stats"),
        axios.get("/bookings/getAll"),
        axios.get("/admin/pending-properties"),
      ]);
      
      setStats(statsRes.data.data);
      setRecentBookings(bookingsRes.data.data);
      setPendingProperties(propertiesRes.data.data);
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Main Content */}
      <div>
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="tex t-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500 mt-0.5">Welcome back, Admin</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-9 pr-4 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">A</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <StatCard
              title="Total Users"
              value={stats?.totalUsers?.toLocaleString()}
              icon={Users}
              trend="+12%"
              trendUp={true}
              color="blue"
            />
            <StatCard
              title="Properties"
              value={stats?.totalProperties?.toLocaleString()}
              icon={Home}
              trend="+5%"
              trendUp={true}
              color="green"
            />
            <StatCard
              title="Bookings"
              value={stats?.totalBookings?.toLocaleString()}
              icon={Calendar}
              trend="+8%"
              trendUp={true}
              color="purple"
            />
            <StatCard
              title="Revenue"
              value={`₹${(stats.totalRevenue / 100000).toFixed(1)}L`}
              icon={DollarSign}
              trend="+15%"
              trendUp={true}
              color="orange"
            />
          </div>

          {/* Pending Approvals Alert */}
          {stats.pendingApprovals > 0 && (
            <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle size={20} className="text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">
                      {stats.pendingApprovals} properties pending approval
                    </p>
                    <p className="text-xs text-yellow-700 mt-0.5">
                      Review and approve new listings to make them live
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/admin/listings?filter=pending")}
                  className="px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-medium hover:bg-yellow-200 transition"
                >
                  Review Now →
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Bookings */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">Recent Bookings</h3>
                <button className="text-xs text-blue-600 hover:text-blue-700">
                  View all
                </button>
              </div>
              <div className="divide-y divide-gray-100">
                {recentBookings.map((booking) => (
                  <div key={booking._id} className="px-5 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">
                          {booking.user?.name?.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {booking.property?.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {booking.user?.name} • ₹{booking.totalPrice?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      booking.status === "confirmed" 
                        ? "bg-green-100 text-green-700"
                        : booking.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Properties */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">Pending Approval</h3>
                <button className="text-xs text-blue-600 hover:text-blue-700">
                  View all
                </button>
              </div>
              <div className="divide-y divide-gray-100">
                {pendingProperties.map((property) => (
                  <div key={property._id} className="px-5 py-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900">{property.title}</p>
                      <div className="flex gap-1">
                        <button className="p-1 hover:bg-green-50 rounded transition">
                          <CheckCircle size={14} className="text-green-600" />
                        </button>
                        <button className="p-1 hover:bg-red-50 rounded transition">
                          <XCircle size={14} className="text-red-600" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{property.location?.city}</span>
                      <span>₹{property.pricePerNight?.toLocaleString()}/night</span>
                      <span>by {property.host?.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <QuickActionCard
              title="Manage Users"
              description="View and manage all platform users"
              icon={Users}
              onClick={() => navigate("/admin/users")}
              color="blue"
            />
            <QuickActionCard
              title="Review Listings"
              description="Approve or reject property listings"
              icon={Home}
              onClick={() => navigate("/admin/listings")}
              color="green"
            />
            <QuickActionCard
              title="View Reports"
              description="Analytics and platform insights"
              icon={TrendingUp}
              onClick={() => navigate("/admin/reports")}
              color="purple"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, trend, trendUp, color }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
  };
  
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl ${colors[color]} flex items-center justify-center`}>
          <Icon size={20} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs ${trendUp ? "text-green-600" : "text-red-600"}`}>
            {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trend}
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{title}</p>
    </div>
  );
};

// Quick Action Card
const QuickActionCard = ({ title, description, icon: Icon, onClick, color }) => {
  const colors = {
    blue: "hover:bg-blue-50",
    green: "hover:bg-green-50",
    purple: "hover:bg-purple-50",
  };
  
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 ${colors[color]} transition text-left`}
    >
      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
        <Icon size={20} className="text-gray-600" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
    </button>
  );
};