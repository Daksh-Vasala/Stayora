import { useState, useEffect } from "react";
import { Search, MoreHorizontal, Loader2 } from "lucide-react";
import axios from "axios";

// ── helpers ───────────────────────────────────────────────────────────────────
const fmt      = iso => new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
const initials = name => name?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";

const STATUS_CLS = {
  active:   "bg-green-50 text-green-700",
  inactive: "bg-red-50 text-red-600",
  blocked:  "bg-red-50 text-red-600",
};

const ROLE_CLS = {
  guest: "bg-blue-50 text-blue-600",
  host:  "bg-purple-50 text-purple-600",
  admin: "bg-orange-50 text-orange-600",
};

export default function AdminUsers() {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [q,       setQ]       = useState("");
  const [filter,  setFilter]  = useState("all");

  // ── Fetch from API ──────────────────────────────────────────────────────────
  useEffect(() => {
    axios.get("/admin/getUsers")           // adjust endpoint if needed
      .then(r => setUsers(r.data.users || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const list = users.filter(u => {
    const matchQ = !q ||
      u.name.toLowerCase().includes(q.toLowerCase()) ||
      u.email.toLowerCase().includes(q.toLowerCase());
    // status from API is isActive boolean → map to "active" / "inactive"
    const status  = u.isActive ? "active" : "inactive";
    const matchF  = filter === "all" || u.role === filter || status === filter;
    return matchQ && matchF;
  });

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <Loader2 size={22} className="animate-spin text-blue-600" />
    </div>
  );

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Users</h1>
        <p className="text-sm text-gray-400 mt-0.5">{users.length} registered users</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5 flex-1 focus-within:border-blue-400 transition-colors shadow-sm">
          <Search size={14} className="text-gray-300 shrink-0" />
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search name or email..."
            className="bg-transparent outline-none text-sm text-gray-800 w-full placeholder:text-gray-300"
          />
        </div>
        <div className="flex gap-1.5">
          {["all", "guest", "host", "admin"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all border-none cursor-pointer
                ${filter === f ? "bg-blue-600 text-white" : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-200"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="hidden md:grid grid-cols-[1.5fr_1.5fr_0.6fr_0.6fr_0.8fr_0.5fr] gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wide">
          <span>User</span><span>Email</span><span>Role</span><span>Status</span><span>Joined</span><span></span>
        </div>

        <div className="divide-y divide-gray-50">
          {list.map(u => {
            const status = u.isActive ? "active" : "inactive";
            return (
              <div key={u._id} className="hover:bg-gray-50/40 transition-colors">

                {/* Desktop */}
                <div className="hidden md:grid grid-cols-[1.5fr_1.5fr_0.6fr_0.6fr_0.8fr_0.5fr] gap-4 px-5 py-3.5 items-center">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center shrink-0">
                      {initials(u.name)}
                    </div>
                    <span className="text-sm font-semibold text-gray-900 truncate">{u.name}</span>
                  </div>
                  <span className="text-sm text-gray-500 truncate">{u.email}</span>
                  <span className={`text-[11px] font-bold px-2 py-1 rounded-full capitalize w-fit ${ROLE_CLS[u.role] || "bg-gray-100 text-gray-500"}`}>
                    {u.role}
                  </span>
                  <span className={`text-[11px] font-semibold px-2 py-1 rounded-full capitalize w-fit ${STATUS_CLS[status]}`}>
                    {status}
                  </span>
                  <span className="text-xs text-gray-400">{fmt(u.createdAt)}</span>
                  <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 border-none cursor-pointer transition-colors">
                    <MoreHorizontal size={14} />
                  </button>
                </div>

                {/* Mobile */}
                <div className="md:hidden flex items-center justify-between px-5 py-4 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center shrink-0">
                      {initials(u.name)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{u.name}</p>
                      <p className="text-[11px] text-gray-400">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${ROLE_CLS[u.role] || "bg-gray-100 text-gray-500"}`}>
                      {u.role}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${STATUS_CLS[status]}`}>
                      {status}
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {list.length === 0 && (
          <div className="py-12 text-center text-sm text-gray-400">No users found.</div>
        )}
      </div>
    </div>
  );
}