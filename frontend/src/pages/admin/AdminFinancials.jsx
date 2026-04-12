import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  Clock,
  Loader,
  Wallet,
  CreditCard,
  Calendar,
  ChevronRight,
} from "lucide-react";

export default function AdminFinancials() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinancials();
  }, []);

  const fetchFinancials = async () => {
    try {
      const { data } = await axios.get("/admin/financials");
      setData(data);
    } catch (error) {
      toast.error("Failed to fetch data");
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

  const { summary, chart, transactions } = data;

  return (
    <div className="p-6 space-y-6 bg-linear-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-2xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Financial Overview
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Track revenue, fees, and payouts across the platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Revenue"
          value={`₹${(summary.totalRevenue / 100000).toFixed(1)}L`}
          subValue={`₹${summary.totalRevenue.toLocaleString()}`}
          change="+18%"
          trend="up"
          icon={DollarSign}
          color="blue"
        />
        <StatCard
          title="Platform Fees"
          value={`₹${(summary.platformFees / 100000).toFixed(1)}L`}
          subValue={`₹${summary.platformFees.toLocaleString()}`}
          change="+18%"
          trend="up"
          icon={CreditCard}
          color="purple"
        />
        <StatCard
          title="Host Payouts"
          value={`₹${(summary.hostPayouts / 100000).toFixed(1)}L`}
          subValue={`₹${summary.hostPayouts.toLocaleString()}`}
          change="+16%"
          trend="up"
          icon={Wallet}
          color="green"
        />
        <StatCard
          title="Pending Payouts"
          value={`₹${(summary.pendingAmount / 1000).toFixed(0)}k`}
          subValue={`₹${summary.pendingAmount.toLocaleString()}`}
          change="+4"
          trend="neutral"
          icon={Clock}
          color="orange"
        />
      </div>

      {/* Chart & Quick Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Revenue Trend
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Last 6 months performance
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-gray-500">Revenue</span>
            </div>
          </div>

          <div className="flex items-end gap-3 h-40">
            {chart.revenue.map((v, i) => {
              const height = (v / chart.maxRevenue) * 100;
              const isHighest = v === chart.maxRevenue;
              return (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-2 group"
                >
                  <div className="relative w-full">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-300 ${
                        isHighest
                          ? "bg-linear-to-t from-blue-500 to-blue-400"
                          : "bg-blue-400 hover:bg-blue-500"
                      }`}
                      style={{ height: `${height}%`, minHeight: "4px" }}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        ₹{(v / 1000).toFixed(0)}k
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-gray-600">
                    {chart.months[i]}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between text-xs text-gray-400">
            <span>
              Total: ₹
              {(chart.revenue.reduce((a, b) => a + b, 0) / 100000).toFixed(1)}L
            </span>
            <span>Best: ₹{(chart.maxRevenue / 1000).toFixed(0)}k</span>
            <span>
              Avg: ₹
              {(chart.revenue.reduce((a, b) => a + b, 0) / 6 / 1000).toFixed(0)}
              k
            </span>
          </div>
        </div>

        {/* Quick Stats Sidebar */}
        <div className="space-y-4">
          <div className="bg-linear-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-blue-100 text-xs">Monthly Growth</p>
                <p className="text-2xl font-bold">
                  +{summary.monthlyGrowth || 18}%
                </p>
              </div>
            </div>
            <p className="text-blue-100 text-xs">
              Revenue increased compared to last month
            </p>
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="flex justify-between text-sm">
                <span className="text-blue-100">This Month</span>
                <span className="font-semibold">
                  ₹{((summary.totalRevenue * 0.18) / 1000).toFixed(0)}k
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Platform Health
              </h4>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">Commission Rate</span>
                  <span className="font-semibold text-gray-900">15%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className="bg-blue-600 h-1.5 rounded-full w-[15%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">Avg. Booking Value</span>
                  <span className="font-semibold text-gray-900">
                    ₹
                    {(
                      summary.totalRevenue / (transactions.length || 1)
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">Total Transactions</span>
                  <span className="font-semibold text-gray-900">
                    {transactions.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Recent Transactions
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Latest completed bookings
            </p>
          </div>
          <button className="text-xs text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">
            View All <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Guest
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Property
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {transactions.map((t, idx) => (
                <tr
                  key={t.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center">
                        {t.guest.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {t.guest}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          ID: {t.id.slice(-8)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-700">{t.property}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span className="text-sm text-gray-600">{t.date}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="text-sm font-bold text-gray-900">
                      ₹{t.amount.toLocaleString()}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full bg-green-50 text-green-700">
                      <CheckCircle className="w-3 h-3" />
                      Completed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {transactions.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">
            No transactions yet
          </div>
        )}
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({
  title,
  value,
  subValue,
  change,
  trend,
  icon: Icon,
  color,
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
  };

  const trendColors = {
    up: "text-green-600 bg-green-50",
    down: "text-red-600 bg-red-50",
    neutral: "text-amber-600 bg-amber-50",
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br from-gray-50 to-transparent rounded-full -mr-12 -mt-12"></div>
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className={`p-2.5 rounded-xl ${colors[color]}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div
            className={`flex items-center gap-0.5 px-2 py-1 rounded-full text-xs font-medium ${trendColors[trend]}`}
          >
            {trend === "up" && <ArrowUpRight className="w-3 h-3" />}
            {trend === "down" && <ArrowDownRight className="w-3 h-3" />}
            {change}
          </div>
        </div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-400 mt-0.5">{subValue}</p>
        <p className="text-xs font-medium text-gray-600 mt-3">{title}</p>
      </div>
    </div>
  );
}
