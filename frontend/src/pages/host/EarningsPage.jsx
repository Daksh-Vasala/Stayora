// EarningsPage.jsx
import { useState, useEffect, useMemo } from "react";
import {
  DollarSign,
  Clock,
  TrendingUp,
  Home,
  ChevronRight,
  Calendar,
  Award,
  Wallet,
  ArrowUp,
  ArrowDown,
  Eye,
} from "lucide-react";
import axios from "axios";

function EarningsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState("6"); // months

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const response = await axios.get("/host/earnings");
      setData(response.data);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    if (!data) return null;
    const monthlyData = data.monthlyData || [];
    const currentMonth = monthlyData[monthlyData.length - 1]?.amount || 0;
    const previousMonth = monthlyData[monthlyData.length - 2]?.amount || 0;
    const monthOverMonth = previousMonth ? ((currentMonth - previousMonth) / previousMonth * 100).toFixed(1) : 0;
    
    return {
      totalEarned: data.totalEarned || 0,
      pendingPayout: data.pendingPayout || 0,
      pendingCount: data.pendingCount || 0,
      thisMonth: currentMonth,
      monthOverMonth: monthOverMonth,
      averagePerBooking: data.totalBookings ? (data.totalEarned / data.totalBookings).toFixed(0) : 0
    };
  }, [data]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading earnings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-6">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center max-w-md">
          <p className="text-red-600 text-sm mb-3">{error}</p>
          <button
            onClick={fetchEarnings}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
            Earnings Overview
          </h1>
          <p className="text-sm md:text-base text-gray-500 mt-1">
            Track your revenue, payouts, and property performance
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Revenue"
            amount={`₹${stats?.totalEarned?.toLocaleString() || 0}`}
            subtitle="All time earnings"
            icon={DollarSign}
            trend="+12.5%"
            color="blue"
          />
          <StatCard
            title="Pending Payout"
            amount={`₹${stats?.pendingPayout?.toLocaleString() || 0}`}
            subtitle={`${stats?.pendingCount || 0} upcoming payouts`}
            icon={Clock}
            color="orange"
          />
          <StatCard
            title="This Month"
            amount={`₹${stats?.thisMonth?.toLocaleString() || 0}`}
            subtitle={`${stats?.monthOverMonth >= 0 ? '+' : ''}${stats?.monthOverMonth}% vs last month`}
            icon={TrendingUp}
            trend={stats?.monthOverMonth >= 0 ? 'up' : 'down'}
            color="green"
          />
          <StatCard
            title="Avg. per Booking"
            amount={`₹${stats?.averagePerBooking?.toLocaleString() || 0}`}
            subtitle={`${data?.totalBookings || 0} total bookings`}
            icon={Wallet}
            color="purple"
          />
        </div>

        {/* Chart and Top Properties Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Monthly Chart - Takes 2/3 on desktop */}
          <div className="lg:col-span-2 bg-white rounded-xl md:rounded-2xl border border-gray-200 shadow-sm p-5 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
              <div>
                <h3 className="font-semibold text-gray-900">Monthly Revenue</h3>
                <p className="text-xs text-gray-400 mt-0.5">Last {timeframe} months</p>
              </div>
              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                {["3", "6", "12"].map((m) => (
                  <button
                    key={m}
                    onClick={() => setTimeframe(m)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      timeframe === m
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {m}M
                  </button>
                ))}
              </div>
            </div>

            <div className="relative h-64 md:h-72">
              <div className="flex items-end gap-3 h-full">
                {(data?.monthlyData || []).slice(-parseInt(timeframe)).map((item, i) => {
                  const maxAmount = Math.max(...(data?.monthlyData || []).map(m => m.amount));
                  const height = maxAmount ? (item.amount / maxAmount) * 100 : 0;
                  
                  return (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center gap-2 group"
                    >
                      <div className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-xl transition-all duration-300 hover:from-blue-600 hover:to-blue-500 relative cursor-pointer"
                        style={{ height: `${height}%`, minHeight: "30px" }}
                      >
                        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
                          ₹{item.amount.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 font-medium">{item.month}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-gray-400">Total</p>
                <p className="text-sm font-semibold text-gray-900">
                  ₹{(data?.monthlyData?.reduce((sum, m) => sum + m.amount, 0) || 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Best Month</p>
                <p className="text-sm font-semibold text-gray-900">
                  ₹{Math.max(...(data?.monthlyData?.map(m => m.amount) || [0])).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Average</p>
                <p className="text-sm font-semibold text-gray-900">
                  ₹{Math.round((data?.monthlyData?.reduce((sum, m) => sum + m.amount, 0) || 0) / (data?.monthlyData?.length || 1)).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Top Properties - Takes 1/3 on desktop */}
          <div className="bg-white rounded-xl md:rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Top Properties</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Best performers</p>
                </div>
                <Award size={18} className="text-yellow-500" />
              </div>
            </div>

            {!data?.topProperties?.length ? (
              <div className="px-5 py-12 text-center">
                <Home size={32} className="text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-400">No bookings yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {data.topProperties.slice(0, 5).map((property, idx) => (
                  <div
                    key={property.id}
                    className="px-5 py-3 hover:bg-gray-50 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm ${
                          idx === 0 ? "bg-yellow-500" : 
                          idx === 1 ? "bg-gray-400" : 
                          idx === 2 ? "bg-orange-500" : "bg-blue-500"
                        }`}>
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {property.title}
                          </p>
                          <p className="text-xs text-gray-400">
                            {property.bookings} booking{property.bookings !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">
                          ₹{property.earned.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity Section */}
        {data?.recentBookings?.length > 0 && (
          <div className="bg-white rounded-xl md:rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 md:px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <h3 className="font-semibold text-gray-900">Recent Activity</h3>
              <p className="text-xs text-gray-400 mt-0.5">Latest completed bookings</p>
            </div>
            <div className="divide-y divide-gray-100">
              {data.recentBookings.slice(0, 5).map((booking) => (
                <div key={booking.id} className="px-5 md:px-6 py-3 hover:bg-gray-50 transition-all">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {booking.property}
                      </p>
                      <p className="text-xs text-gray-400">
                        {booking.guest} • {new Date(booking.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-600">
                        +₹{booking.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Stat Card Component - Enhanced
function StatCard({ title, amount, subtitle, icon: Icon, trend, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
  };

  const bgColors = {
    blue: "from-blue-50 to-white",
    orange: "from-orange-50 to-white",
    green: "from-green-50 to-white",
    purple: "from-purple-50 to-white",
  };

  return (
    <div className={`bg-gradient-to-br ${bgColors[color]} rounded-xl md:rounded-2xl border border-gray-200 p-5 hover:shadow-lg transition-all duration-300 group`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-xl ${colors[color]} group-hover:scale-110 transition-transform`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <div className={`flex items-center gap-0.5 text-xs font-medium ${
            trend === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend === 'up' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
            <span>{Math.abs(parseFloat(subtitle))}%</span>
          </div>
        )}
      </div>
      <p className="text-2xl md:text-3xl font-bold text-gray-900">{amount}</p>
      <p className="text-sm font-medium text-gray-700 mt-1">{title}</p>
      <p className="text-xs text-gray-400 mt-2">{subtitle}</p>
    </div>
  );
}

export default EarningsPage;