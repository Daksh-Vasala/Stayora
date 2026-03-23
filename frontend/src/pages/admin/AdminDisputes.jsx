import { useState } from "react";
import {
  ShieldAlert,
  Clock,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const DISPUTES = [
  {
    id: "DP001",
    guest: "Priya Sharma",
    host: "Raj Shah",
    property: "Luxury Beach Villa",
    issue:
      "Property not as described — pool was under maintenance during the entire stay.",
    amount: "₹30,000",
    date: "Dec 28, 2024",
    status: "open",
  },
  {
    id: "DP002",
    guest: "Rohan Mehta",
    host: "Raj Shah",
    property: "Modern City Apartment",
    issue:
      "Host cancelled 24 hours before check-in. No alternative was offered.",
    amount: "₹12,600",
    date: "Jan 3, 2025",
    status: "resolved",
  },
  {
    id: "DP003",
    guest: "Anjali Singh",
    host: "Arjun Verma",
    property: "Cozy Hill Cottage",
    issue: "Refund not received 10 days after approved cancellation.",
    amount: "₹17,500",
    date: "Jan 10, 2025",
    status: "open",
  },
  {
    id: "DP004",
    guest: "Vikram Patel",
    host: "Vikram Patel",
    property: "Luxury Penthouse",
    issue:
      "Security deposit not returned despite property being in perfect condition.",
    amount: "₹10,000",
    date: "Feb 4, 2025",
    status: "pending",
  },
  {
    id: "DP005",
    guest: "Neha Gupta",
    host: "Sneha Kapoor",
    property: "Heritage Haveli",
    issue: "Amenities like AC and Wi-Fi were not working. Host unresponsive.",
    amount: "₹8,900",
    date: "Feb 10, 2025",
    status: "open",
  },
];

const STATUS_CFG = {
  open: { cls: "bg-red-50 text-red-600", Icon: ShieldAlert, dot: "bg-red-500" },
  pending: {
    cls: "bg-amber-50 text-amber-700",
    Icon: Clock,
    dot: "bg-amber-400",
  },
  resolved: {
    cls: "bg-green-50 text-green-700",
    Icon: CheckCircle,
    dot: "bg-green-500",
  },
};

export default function AdminDisputes() {
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);

  const list =
    filter === "all" ? DISPUTES : DISPUTES.filter((d) => d.status === filter);
  const counts = {
    open: DISPUTES.filter((d) => d.status === "open").length,
    pending: DISPUTES.filter((d) => d.status === "pending").length,
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Disputes</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            <span className="text-red-500 font-semibold">
              {counts.open} open
            </span>
            {" · "}
            <span className="text-amber-600 font-semibold">
              {counts.pending} pending
            </span>
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5">
        {["all", "open", "pending", "resolved"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all border-none cursor-pointer
              ${filter === f ? "bg-blue-600 text-white" : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-200"}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Dispute cards */}
      <div className="space-y-3">
        {list.map((d) => {
          const S = STATUS_CFG[d.status];
          const open = expanded === d.id;
          return (
            <div
              key={d.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              {/* Header row */}
              <button
                onClick={() => setExpanded(open ? null : d.id)}
                className="w-full flex items-center gap-3 px-5 py-4 text-left cursor-pointer border-none bg-transparent hover:bg-gray-50/50 transition-colors"
              >
                <span className={`w-2 h-2 rounded-full shrink-0 ${S.dot}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-bold text-gray-400">
                      {d.id}
                    </span>
                    <span className="text-sm font-semibold text-gray-900 truncate">
                      {d.property}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-0.5 truncate">
                    {d.guest} vs {d.host} · {d.date}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-bold text-gray-900">
                    {d.amount}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${S.cls}`}
                  >
                    {d.status}
                  </span>
                  {open ? (
                    <ChevronUp size={14} className="text-gray-400" />
                  ) : (
                    <ChevronDown size={14} className="text-gray-400" />
                  )}
                </div>
              </button>

              {/* Expanded detail */}
              {open && (
                <div className="px-5 pb-5 border-t border-gray-50">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 mb-4">
                    {[
                      ["Guest", d.guest],
                      ["Host", d.host],
                      ["Amount in Dispute", d.amount],
                    ].map(([l, v]) => (
                      <div key={l}>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                          {l}
                        </p>
                        <p className="text-sm font-semibold text-gray-900 mt-0.5">
                          {v}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gray-50 rounded-xl p-3.5 mb-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">
                      Issue reported
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {d.issue}
                    </p>
                  </div>

                  {d.status !== "resolved" && (
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl border-none cursor-pointer transition-colors">
                        <CheckCircle size={13} /> Mark Resolved
                      </button>
                      <button className="flex items-center gap-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold px-4 py-2 rounded-xl border-none cursor-pointer bg-white transition-colors">
                        <XCircle size={13} /> Dismiss
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {list.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 py-12 text-center text-sm text-gray-400 shadow-sm">
          No disputes found.
        </div>
      )}
    </div>
  );
}
