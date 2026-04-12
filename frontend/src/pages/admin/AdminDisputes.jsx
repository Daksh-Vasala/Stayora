import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  ShieldAlert,
  Clock,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Loader,
} from "lucide-react";

const STATUS_CFG = {
  open: {
    cls: "bg-red-50 text-red-600",
    Icon: ShieldAlert,
    dot: "bg-red-500",
    label: "Open",
  },
  resolved: {
    cls: "bg-green-50 text-green-700",
    Icon: CheckCircle,
    dot: "bg-green-500",
    label: "Resolved",
  },
  rejected: {
    cls: "bg-gray-50 text-gray-600",
    Icon: XCircle,
    dot: "bg-gray-500",
    label: "Rejected",
  },
};

export default function AdminDisputes() {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);
  const [updating, setUpdating] = useState(null);
  const [resolutionText, setResolutionText] = useState("");

  useEffect(() => {
    fetchDisputes();
  }, [filter]);

  const fetchDisputes = async () => {
    try {
      setLoading(true);
      const url =
        filter === "all"
          ? "/admin/get-disputes"
          : `/admin/get-disputes?status=${filter}`;

      const { data } = await axios.get(url);
      setDisputes(data.disputes || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch disputes");
    } finally {
      setLoading(false);
    }
  };

  const updateDisputeStatus = async (id, status, resolution = "") => {
    try {
      setUpdating(id);
      const { data } = await axios.put(`/admin/update-dispute/${id}`, {
        status,
        resolution,
      });

      toast.success(`Dispute marked as ${status}`);
      fetchDisputes();
      setExpanded(null);
      setResolutionText("");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update dispute");
    } finally {
      setUpdating(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatAmount = (amount) => {
    return `₹${amount?.toLocaleString() || 0}`;
  };

  const counts = {
    open: disputes.filter((d) => d.status === "open").length,
    rejected: disputes.filter((d) => d.status === "rejected").length,
    resolved: disputes.filter((d) => d.status === "resolved").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

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
            <span className="text-gray-500 font-semibold">
              {counts.resolved} resolved
            </span>
            {" · "}
            <span className="text-gray-500 font-semibold">
              {counts.rejected} rejected
            </span>
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {["all", "open", "resolved", "rejected"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all border-none cursor-pointer
              ${filter === f ? "bg-blue-600 text-white" : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-200"}`}
          >
            {f} {f !== "all" && `(${counts[f] || 0})`}
          </button>
        ))}
      </div>

      {/* Dispute cards */}
      <div className="space-y-3">
        {disputes.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 py-12 text-center text-sm text-gray-400 shadow-sm">
            No disputes found.
          </div>
        ) : (
          disputes.map((dispute) => {
            const S = STATUS_CFG[dispute.status];
            const Icon = S.Icon;
            const open = expanded === dispute._id;
            const isUpdating = updating === dispute._id;

            return (
              <div
                key={dispute._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                {/* Header row */}
                <button
                  onClick={() => setExpanded(open ? null : dispute._id)}
                  className="w-full flex items-center gap-3 px-5 py-4 text-left cursor-pointer border-none bg-transparent hover:bg-gray-50/50 transition-colors"
                >
                  <span className={`w-2 h-2 rounded-full shrink-0 ${S.dot}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-bold text-gray-400">
                        #{dispute._id.slice(-8)}
                      </span>
                      <span className="text-sm font-semibold text-gray-900 truncate">
                        {dispute.booking?.property?.title || "Unknown Property"}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5 truncate">
                      {dispute.raisedBy?.name || "Unknown"} ·{" "}
                      {formatDate(dispute.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm font-bold text-gray-900">
                      {formatAmount(dispute.booking?.totalPrice)}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize flex items-center gap-0.5 ${S.cls}`}
                    >
                      <Icon size={10} />
                      {S.label}
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
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                          Raised By
                        </p>
                        <p className="text-sm font-semibold text-gray-900 mt-0.5">
                          {dispute.raisedBy?.name || "Unknown"}
                        </p>
                        <p className="text-xs text-gray-400">
                          {dispute.raisedBy?.email || ""}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                          Property
                        </p>
                        <p className="text-sm font-semibold text-gray-900 mt-0.5">
                          {dispute.booking?.property?.title || "Unknown"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                          Amount
                        </p>
                        <p className="text-sm font-semibold text-gray-900 mt-0.5">
                          {formatAmount(dispute.booking?.totalPrice)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                          Booking ID
                        </p>
                        <p className="text-sm font-semibold text-gray-900 mt-0.5">
                          #{dispute.booking?._id?.slice(-8)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                          Stay Dates
                        </p>
                        <p className="text-sm font-semibold text-gray-900 mt-0.5">
                          {formatDate(dispute.booking?.checkIn)} -{" "}
                          {formatDate(dispute.booking?.checkOut)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                          Dispute Created
                        </p>
                        <p className="text-sm font-semibold text-gray-900 mt-0.5">
                          {formatDate(dispute.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-3.5 mb-4">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">
                        Issue reported
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {dispute.reason}
                      </p>
                    </div>

                    {/* Resolution field for resolving dispute */}
                    {dispute.status === "open" && (
                      <div className="mb-4">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1 block">
                          Resolution Details
                        </label>
                        <textarea
                          value={resolutionText}
                          onChange={(e) => setResolutionText(e.target.value)}
                          placeholder="Enter resolution details (e.g., Full refund issued, Partial refund, etc.)"
                          rows="2"
                          className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}

                    {/* Show resolution if dispute is resolved */}
                    {dispute.status !== "open" && dispute.resolution && (
                      <div className={`${dispute.status === "resolved" ? "bg-green-50" : "bg-zinc-50"} rounded-xl p-3.5 mb-4`}>
                        <p className={`text-[10px] ${dispute.status === "resolved" ?  "text-green-600" : "text-zinc-600"} font-bold uppercase tracking-wide mb-1`}>
                          Resolution
                        </p>
                        <p className={`text-sm ${dispute.status === "resolved" ?  "text-green-700" : "text-zinc-700"} leading-relaxed`}>
                          {dispute.resolution}
                        </p>
                        {dispute.resolvedAt && (
                          <p className={`text-xs ${dispute.status === "resolved" ?  "text-green-600" : "text-zinc-600"} mt-2`}>
                            Resolved on: {formatDate(dispute.resolvedAt)}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Action buttons */}
                    {dispute.status === "open" && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() =>
                            updateDisputeStatus(
                              dispute._id,
                              "resolved",
                              resolutionText,
                            )
                          }
                          disabled={isUpdating}
                          className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
                        >
                          <CheckCircle size={13} /> Mark Resolved
                        </button>
                        <button
                          onClick={() =>
                            updateDisputeStatus(dispute._id, "rejected", resolutionText)
                          }
                          disabled={isUpdating}
                          className="flex items-center gap-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold px-4 py-2 rounded-xl bg-white transition-colors disabled:opacity-50"
                        >
                          <XCircle size={13} /> Reject
                        </button>
                      </div>
                    )}

                    {dispute.status === "resolved" && (
                      <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl">
                        <CheckCircle size={16} className="text-green-600" />
                        <p className="text-sm text-green-700">
                          This dispute has been resolved.
                        </p>
                      </div>
                    )}

                    {dispute.status === "rejected" && (
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                        <XCircle size={16} className="text-gray-600" />
                        <p className="text-sm text-gray-700">
                          This dispute has been rejected.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
