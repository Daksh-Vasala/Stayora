// EarningsPage.jsx - Minimal & Clean
import { useState, useEffect } from "react";
import { Calendar, TrendingUp, Wallet, Home, DollarSign } from "lucide-react";
import axios from "axios"

function EarningsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const res = await axios.get("/host/earnings");
      setData(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading earnings...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
        <p className="text-sm text-gray-500 mt-1">Your revenue at a glance</p>
      </div>

      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard
          icon={<Wallet className="w-5 h-5" />}
          title="This Month"
          amount={`₹${data?.thisMonth?.toLocaleString()}`}
          trend={data.monthTrend}
          color="blue"
        />
        <SummaryCard
          icon={<Calendar className="w-5 h-5" />}
          title="This Year"
          amount={`₹${data?.thisYear.toLocaleString()}`}
          subtitle={`${data?.propertyCount} properties`}
          color="green"
        />
        <SummaryCard
          icon={<DollarSign className="w-5 h-5" />}
          title="Pending Payout"
          amount={`₹${data?.pendingAmount.toLocaleString()}`}
          subtitle={`${data?.pendingCount} upcoming`}
          color="orange"
        />
      </div>

      {/* Simple Bar Chart */}
      <div className="bg-white rounded-xl border p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-6">
          Last 6 Months
        </h3>
        <div className="flex items-end gap-3 h-48">
          {data?.monthlyRevenue.map((item, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full bg-blue-500 rounded-t-lg transition-all hover:bg-blue-600"
                style={{
                  height: `${(item?.revenue / data?.maxRevenue) * 100}%`,
                  minHeight: "4px",
                }}
              />
              <span className="text-xs text-gray-500">{item?.month}</span>
              <span className="text-xs font-medium text-gray-700">
                ₹{item?.revenue / 1000}k
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Properties List - Just 3 lines */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-sm font-semibold text-gray-900">
            Top Properties
          </h3>
        </div>
        <div className="divide-y">
          {data.topProperties.map((property) => (
            <div
              key={property?.id}
              className="flex items-center justify-between px-6 py-4 hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <img
                  src={property?.image}
                  alt=""
                  className="w-10 h-10 rounded-lg object-cover"
                  onError={(e) => (e.target.style.display = "none")}
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {property?.title}
                  </p>
                  <p className="text-xs text-gray-400">
                    {property?.bookings} bookings
                  </p>
                </div>
              </div>
              <p className="text-sm font-bold text-gray-900">
                ₹{property?.earned?.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Reusable Summary Card Component
function SummaryCard({ icon, title, amount, trend, subtitle, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <div className="bg-white rounded-xl border p-5">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg ${colors[color]}`}>{icon}</div>
        {trend && (
          <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
            +{trend}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900">{amount}</p>
      <p className="text-sm text-gray-500 mt-1">{title}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </div>
  );
}

export default EarningsPage;