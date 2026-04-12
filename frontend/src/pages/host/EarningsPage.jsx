// EarningsPage.jsx
import { useState, useEffect } from "react";
import { DollarSign, Clock, TrendingUp, Home, ChevronRight } from "lucide-react";
import axios from "axios"

function EarningsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const response = await axios.get("/host/earnings", {
      });
    
      setData(response.data);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400 text-sm mt-3">Loading earnings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 text-sm">Error: {error}</p>
          <button 
            onClick={fetchEarnings}
            className="mt-3 text-blue-500 text-sm hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
        <p className="text-gray-500 text-sm mt-1">Track your revenue and payouts</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <StatCard
          title="Total Earned"
          amount={`₹${data.totalEarned.toLocaleString()}`}
          subtitle="All time revenue"
          icon={DollarSign}
          color="blue"
        />
        <StatCard
          title="Pending Payout"
          amount={`₹${data.pendingPayout.toLocaleString()}`}
          subtitle={`${data.pendingCount} upcoming ${data.pendingCount === 1 ? 'payment' : 'payments'}`}
          icon={Clock}
          color="orange"
        />
        <StatCard
          title="This Month"
          amount={`₹${data.thisMonth.toLocaleString()}`}
          subtitle={`${data.monthlyGrowth >= 0 ? '+' : ''}${data.monthlyGrowth}% from last month`}
          icon={TrendingUp}
          color="green"
        />
      </div>

      {/* Monthly Chart */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-gray-900">Monthly Revenue</h3>
            <p className="text-xs text-gray-400 mt-0.5">Last 6 months</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-xs text-gray-500">Completed bookings</span>
          </div>
        </div>

        <div className="flex items-end gap-4 h-48">
          {data.monthlyData.map((item, i) => {
            const height = (item.amount / data.maxAmount) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="text-xs text-gray-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  ₹{item.amount.toLocaleString()}
                </div>
                <div
                  className="w-full bg-blue-500 rounded-lg transition-all hover:bg-blue-600 cursor-pointer relative"
                  style={{ height: `${height}%`, minHeight: "4px" }}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    ₹{item.amount.toLocaleString()}
                  </div>
                </div>
                <div className="text-xs text-gray-400 mt-1">{item.month}</div>
              </div>
            );
          })}
        </div>

        {/* Simple legend */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between text-xs text-gray-400">
          <span>Total: ₹{data.monthlyData.reduce((sum, m) => sum + m.amount, 0).toLocaleString()}</span>
          <span>Best: ₹{Math.max(...data.monthlyData.map(m => m.amount)).toLocaleString()}</span>
          <span>Average: ₹{Math.round(data.monthlyData.reduce((sum, m) => sum + m.amount, 0) / 6).toLocaleString()}</span>
        </div>
      </div>

      {/* Top Properties */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Top Performing Properties</h3>
          <p className="text-xs text-gray-400 mt-0.5">Based on completed bookings</p>
        </div>
        
        {data.topProperties.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-400 text-sm">
            No completed bookings yet
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {data.topProperties.map((property, idx) => (
              <div
                key={property.id}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{property.title}</p>
                    <p className="text-xs text-gray-400">{property.bookings} {property.bookings === 1 ? 'booking' : 'bookings'}</p>
                  </div>
                </div>
                <p className="font-semibold text-gray-900">
                  ₹{property.earned.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, amount, subtitle, icon: Icon, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600",
    green: "bg-green-50 text-green-600",
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg ${colors[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{amount}</p>
      <p className="text-sm font-medium text-gray-700 mt-1">{title}</p>
      <p className="text-xs text-gray-400 mt-2">{subtitle}</p>
    </div>
  );
}

export default EarningsPage;