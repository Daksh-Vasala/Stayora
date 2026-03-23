import {
  Users,
  Home,
  DollarSign,
  ShieldAlert,
  TrendingUp,
  TrendingDown,
  MapPin,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

const STATS = [
  {
    label: "Total Users",
    value: "12,345",
    change: "+12%",
    up: true,
    icon: Users,
  },
  {
    label: "Active Listings",
    value: "856",
    change: "+5%",
    up: true,
    icon: Home,
  },
  {
    label: "Total Revenue",
    value: "₹4.5L",
    change: "+18%",
    up: true,
    icon: DollarSign,
  },
  {
    label: "Pending Disputes",
    value: "12",
    change: "-2",
    up: false,
    icon: ShieldAlert,
  },
];

const BOOKINGS = [
  {
    id: "BK001",
    guest: "Priya Sharma",
    property: "Luxury Beach Villa",
    date: "Dec 24, 2024",
    amount: "₹30,000",
    status: "confirmed",
  },
  {
    id: "BK002",
    guest: "Rohan Mehta",
    property: "Modern City Apartment",
    date: "Jan 5, 2025",
    amount: "₹12,600",
    status: "pending",
  },
  {
    id: "BK003",
    guest: "Anjali Singh",
    property: "Cozy Hill Cottage",
    date: "Jan 15, 2025",
    amount: "₹17,500",
    status: "confirmed",
  },
  {
    id: "BK004",
    guest: "Vikram Patel",
    property: "Luxury Penthouse",
    date: "Feb 1, 2025",
    amount: "₹19,000",
    status: "cancelled",
  },
  {
    id: "BK005",
    guest: "Neha Gupta",
    property: "Luxury Beach Villa",
    date: "Feb 8, 2025",
    amount: "₹37,500",
    status: "confirmed",
  },
];

const STATUS = {
  confirmed: { cls: "bg-green-50 text-green-700", Icon: CheckCircle },
  pending: { cls: "bg-amber-50 text-amber-700", Icon: Clock },
  cancelled: { cls: "bg-red-50 text-red-600", Icon: XCircle },
};

export default function AdminDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Platform overview and real-time metrics
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(({ label, value, change, up, icon: Icon }) => (
          <div
            key={label}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-gray-400 font-medium">{label}</p>
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <Icon size={15} className="text-blue-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p
              className={`text-xs font-semibold mt-1.5 flex items-center gap-1 ${up ? "text-green-600" : "text-red-500"}`}
            >
              {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {change} this month
            </p>
          </div>
        ))}
      </div>

      {/* Recent bookings */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900">Recent Bookings</h3>
          <button className="text-xs font-semibold text-blue-600 hover:underline border-none bg-transparent cursor-pointer">
            View all
          </button>
        </div>

        {/* Desktop table */}
        <div className="hidden sm:grid grid-cols-[1fr_1.2fr_0.9fr_0.8fr_0.8fr] gap-4 px-5 py-2.5 bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wide">
          <span>Guest</span>
          <span>Property</span>
          <span>Date</span>
          <span>Amount</span>
          <span>Status</span>
        </div>

        <div className="divide-y divide-gray-50">
          {BOOKINGS.map((b) => {
            const S = STATUS[b.status];
            return (
              <div key={b.id} className="hover:bg-gray-50/50 transition-colors">
                {/* Desktop */}
                <div className="hidden sm:grid grid-cols-[1fr_1.2fr_0.9fr_0.8fr_0.8fr] gap-4 px-5 py-3.5 items-center">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold flex items-center justify-center shrink-0">
                      {b.guest
                        .split(" ")
                        .map((w) => w[0])
                        .join("")}
                    </div>
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {b.guest}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-gray-500 truncate">
                    <MapPin size={11} className="text-blue-400 shrink-0" />
                    {b.property}
                  </div>
                  <span className="text-sm text-gray-500">{b.date}</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {b.amount}
                  </span>
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-full w-fit ${S.cls}`}
                  >
                    {b.status}
                  </span>
                </div>
                {/* Mobile */}
                <div className="sm:hidden px-5 py-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-[11px] font-bold flex items-center justify-center shrink-0">
                      {b.guest
                        .split(" ")
                        .map((w) => w[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {b.guest}
                      </p>
                      <p className="text-[11px] text-gray-400 truncate max-w-35">
                        {b.property}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-gray-900">
                      {b.amount}
                    </p>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${S.cls}`}
                    >
                      {b.status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
