import {
  DollarSign,
  TrendingUp,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle,
  Clock,
} from "lucide-react";

const MONTHS = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const VALUES = [120000, 185000, 142000, 230000, 198000, 312000];
const MAX = Math.max(...VALUES);

const TRANSACTIONS = [
  {
    id: "TXN001",
    guest: "Priya Sharma",
    property: "Luxury Beach Villa",
    amount: 30000,
    type: "booking",
    date: "Dec 24",
    status: "completed",
  },
  {
    id: "TXN002",
    guest: "Rohan Mehta",
    property: "Modern City Apartment",
    amount: 12600,
    type: "booking",
    date: "Jan 5",
    status: "pending",
  },
  {
    id: "TXN003",
    guest: "Anjali Singh",
    property: "Cozy Hill Cottage",
    amount: 17500,
    type: "booking",
    date: "Jan 15",
    status: "completed",
  },
  {
    id: "TXN004",
    guest: "Raj Shah",
    property: "Luxury Beach Villa",
    amount: 25500,
    type: "payout",
    date: "Jan 18",
    status: "completed",
  },
  {
    id: "TXN005",
    guest: "Vikram Patel",
    property: "Lakeside Villa",
    amount: 42000,
    type: "booking",
    date: "Feb 1",
    status: "completed",
  },
  {
    id: "TXN006",
    guest: "Vikram Patel",
    property: "Lakeside Villa",
    amount: 35700,
    type: "payout",
    date: "Feb 5",
    status: "pending",
  },
];

const STATUS_CLS = {
  completed: "bg-green-50 text-green-700",
  pending: "bg-amber-50 text-amber-700",
};

export default function AdminFinancials() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Financials</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Revenue, payouts and transaction history
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: "₹12.8L", change: "+18%", up: true },
          { label: "Platform Fees", value: "₹1.28L", change: "+18%", up: true },
          { label: "Host Payouts", value: "₹11.5L", change: "+16%", up: true },
          { label: "Pending", value: "₹48,100", change: "+4", up: false },
        ].map((c) => (
          <div
            key={c.label}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
          >
            <p className="text-xs text-gray-400 font-medium mb-2">{c.label}</p>
            <p className="text-xl font-bold text-gray-900">{c.value}</p>
            <p
              className={`text-xs font-semibold mt-1.5 flex items-center gap-1 ${c.up ? "text-green-600" : "text-amber-600"}`}
            >
              {c.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {c.change} this month
            </p>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-sm font-bold text-gray-900 mb-5">
          Monthly Revenue
        </h3>
        <div className="flex items-end gap-3 h-32">
          {VALUES.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <span className="text-[10px] text-gray-400">
                ₹
                {v >= 100000
                  ? (v / 100000).toFixed(1) + "L"
                  : (v / 1000).toFixed(0) + "k"}
              </span>
              <div
                className="w-full bg-blue-600 hover:bg-blue-700 rounded-t-lg transition-colors"
                style={{ height: `${(v / MAX) * 100}%`, minHeight: 6 }}
              />
              <span className="text-[11px] text-gray-400">{MONTHS[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900">
            Recent Transactions
          </h3>
        </div>
        <div className="hidden sm:grid grid-cols-[1fr_1.3fr_0.7fr_0.7fr_0.7fr] gap-4 px-5 py-2.5 bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wide">
          <span>Party</span>
          <span>Property</span>
          <span>Amount</span>
          <span>Type</span>
          <span>Status</span>
        </div>
        <div className="divide-y divide-gray-50">
          {TRANSACTIONS.map((t) => (
            <div key={t.id} className="hover:bg-gray-50/40 transition-colors">
              {/* Desktop */}
              <div className="hidden sm:grid grid-cols-[1fr_1.3fr_0.7fr_0.7fr_0.7fr] gap-4 px-5 py-3.5 items-center">
                <div>
                  <p className="text-sm font-medium text-gray-900">{t.guest}</p>
                  <p className="text-[11px] text-gray-400">{t.date}</p>
                </div>
                <span className="text-sm text-gray-500 truncate">
                  {t.property}
                </span>
                <span
                  className={`text-sm font-bold ${t.type === "payout" ? "text-orange-600" : "text-gray-900"}`}
                >
                  {t.type === "payout" ? "-" : "+"}₹{t.amount.toLocaleString()}
                </span>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full w-fit capitalize ${t.type === "payout" ? "bg-orange-50 text-orange-600" : "bg-blue-50 text-blue-600"}`}
                >
                  {t.type}
                </span>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full w-fit ${STATUS_CLS[t.status]}`}
                >
                  {t.status}
                </span>
              </div>
              {/* Mobile */}
              <div className="sm:hidden px-5 py-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {t.guest}
                  </p>
                  <p className="text-[11px] text-gray-400">
                    {t.property} · {t.date}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p
                    className={`text-sm font-bold ${t.type === "payout" ? "text-orange-600" : "text-gray-900"}`}
                  >
                    {t.type === "payout" ? "-" : "+"}₹
                    {t.amount.toLocaleString()}
                  </p>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_CLS[t.status]}`}
                  >
                    {t.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
