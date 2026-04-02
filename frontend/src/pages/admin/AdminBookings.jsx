import { useState, useEffect } from "react";
import { Search, MapPin, Calendar, Users, CheckCircle, Clock, XCircle, Eye, Loader2 } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TABS = ["all", "confirmed", "pending", "cancelled"];

const STATUS = {
  confirmed: { label: "Confirmed", cls: "text-green-600",  bg: "bg-green-50",  Icon: CheckCircle },
  pending:   { label: "Pending",   cls: "text-yellow-600", bg: "bg-yellow-50", Icon: Clock       },
  cancelled: { label: "Cancelled", cls: "text-red-500",    bg: "bg-red-50",    Icon: XCircle     },
};

// ── helpers ───────────────────────────────────────────────────────────────────
const fmt     = iso => new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
const initials = name => name?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [tab,      setTab]      = useState("all");
  const [q,        setQ]        = useState("");
  const navigate = useNavigate();

  // ── Fetch from API ──────────────────────────────────────────────────────────
  useEffect(() => {
    axios.get("/bookings/getAll")             // adjust endpoint if needed
      .then(res => setBookings(res.data.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const list = bookings.filter(b => {
    const guestName  = b.guest?.name  || "";
    const propTitle  = b.property?.title || "";
    const matchTab   = tab === "all" || b.status === tab;
    const matchQ     = !q ||
      guestName.toLowerCase().includes(q.toLowerCase())  ||
      propTitle.toLowerCase().includes(q.toLowerCase())  ||
      b._id.toLowerCase().includes(q.toLowerCase());
    return matchTab && matchQ;
  });

  // ── Stats derived from live data ────────────────────────────────────────────
  const stats = [
    { label: "Total Bookings", value: bookings.length },
    { label: "Confirmed",      value: bookings.filter(b => b.status === "confirmed").length },
    { label: "Pending",        value: bookings.filter(b => b.status === "pending").length   },
    { label: "Cancelled",      value: bookings.filter(b => b.status === "cancelled").length },
  ];

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <Loader2 size={22} className="animate-spin text-blue-600" />
    </div>
  );

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Bookings</h1>
        <p className="text-sm text-gray-400 mt-0.5">Manage and monitor all property bookings</p>
      </div>

      {/* Stat cards — derived from live data */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5 flex-1 focus-within:border-blue-400 shadow-sm transition-colors">
          <Search size={14} className="text-gray-400 shrink-0" />
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search guest, property or booking ID..."
            className="bg-transparent outline-none text-sm text-gray-800 w-full placeholder:text-gray-400"
          />
        </div>
        <div className="flex gap-1.5">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all border-none cursor-pointer
                ${tab === t ? "bg-blue-600 text-white" : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Desktop header */}
        <div className="hidden md:grid grid-cols-[2fr_2fr_1.5fr_1fr_1fr_0.5fr] gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wide">
          <span>Guest</span><span>Property</span><span>Dates</span><span>Amount</span><span>Status</span><span></span>
        </div>

        {list.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-400">No bookings found.</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {list.map(b => {
              const S          = STATUS[b.status] || STATUS.pending;
              const guestName  = b.guest?.name  || "Unknown";
              const propTitle  = b.property?.title || "—";
              const city       = b.property?.location?.city || "—";
              const shortId    = b._id.slice(-6).toUpperCase();

              return (
                <div key={b._id} className="hover:bg-gray-50/60 transition-colors">

                  {/* ── Desktop row ── */}
                  <div className="hidden md:grid grid-cols-[2fr_2fr_1.5fr_1fr_1fr_0.5fr] gap-4 px-6 py-4 items-center">

                    {/* Guest */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center shrink-0">
                        {initials(guestName)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{guestName}</p>
                        <p className="text-xs text-gray-400">#{shortId}</p>
                      </div>
                    </div>

                    {/* Property */}
                    <div className="min-w-0">
                      <p className="text-sm text-gray-800 truncate">{propTitle}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <MapPin size={10} className="text-blue-400" /> {city}
                      </p>
                    </div>

                    {/* Dates */}
                    <div>
                      <p className="text-xs text-gray-500">{fmt(b.checkIn)}</p>
                      <p className="text-xs text-gray-400">→ {fmt(b.checkOut)}</p>
                    </div>

                    {/* Amount */}
                    <p className="text-sm font-semibold text-gray-900">₹{b.totalPrice?.toLocaleString()}</p>

                    {/* Status */}
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full w-fit ${S.cls} ${S.bg}`}>
                      <S.Icon size={11} /> {S.label}
                    </span>

                    {/* View */}
                    <button onClick={() => navigate(`/admin/bookings/${b._id}`)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600 border-none cursor-pointer transition-colors">
                      <Eye size={15} />
                    </button>
                  </div>

                  {/* ── Mobile card ── */}
                  <div className="md:hidden px-5 py-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center shrink-0">
                          {initials(guestName)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{guestName}</p>
                          <p className="text-xs text-gray-400">#{shortId}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${S.cls} ${S.bg}`}>
                        {S.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 bg-gray-50 rounded-xl p-3">
                      <div className="flex items-center gap-1.5 col-span-2">
                        <MapPin size={11} className="text-blue-400" /> {propTitle}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users size={11} className="text-blue-400" /> {b.guestsCount} guests
                      </div>
                      <div className="flex items-center gap-1.5 col-span-2">
                        <Calendar size={11} className="text-blue-400" />
                        {fmt(b.checkIn)} → {fmt(b.checkOut)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-gray-900">₹{b.totalPrice?.toLocaleString()}</p>
                      <button className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline border-none bg-transparent cursor-pointer">
                        <Eye size={13} /> View
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}