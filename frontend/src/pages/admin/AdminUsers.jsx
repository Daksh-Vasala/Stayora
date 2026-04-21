import { useState, useEffect } from "react";
import { Search, MessageCircle, Users as UsersIcon } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const fmt = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const initials = (name) =>
  name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";

const STATUS_CLS = {
  active: "bg-green-50 text-green-700",
  inactive: "bg-red-50 text-red-600",
};

const ROLE_CLS = {
  guest: "bg-blue-50 text-blue-600",
  host: "bg-purple-50 text-purple-600",
  admin: "bg-orange-50 text-orange-600",
};

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    axios
      .get("/admin/getUsers")
      .then((r) => setUsers(r.data.users || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleMessage = async (user) => {
    try {
      const { data } = await axios.post("/chats", {
        receiverId: user._id,
      });

      navigate(`/admin/messages`, {
        state: { chatId: data._id },
      });
    } catch (error) {
      console.error("Failed to open chat:", error);
      toast.error("Unable to open chat. Please try again.");
      navigate(`/admin/messages`);
    }
  };

  const filtered = users.filter((u) => {
    const matchQ =
      !q ||
      u.name.toLowerCase().includes(q.toLowerCase()) ||
      u.email.toLowerCase().includes(q.toLowerCase());
    const status = u.isActive ? "active" : "inactive";
    const matchF = filter === "all" || u.role === filter || status === filter;
    return matchQ && matchF;
  });

  if (loading)
    return (
      <div className="flex justify-center py-24">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );

  return (
    <div className=" mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <p className="text-sm text-gray-500 mt-1">
          {users.length} registered users
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm"
          />
        </div>
        <div className="flex gap-1.5">
          {["all", "guest", "host", "admin", "active", "inactive"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize transition-all
                ${filter === f ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="hidden md:grid grid-cols-[1.5fr_1.5fr_0.7fr_0.7fr_0.8fr_0.5fr] gap-4 px-5 py-3 bg-gray-50 text-xs font-semibold text-gray-500">
          <span>User</span>
          <span>Email</span>
          <span>Role</span>
          <span>Status</span>
          <span>Joined</span>
          <span></span>
        </div>

        <div className="divide-y divide-gray-100">
          {filtered.map((u) => {
            const status = u.isActive ? "active" : "inactive";
            return (
              <div key={u._id} className="hover:bg-gray-50">
                {/* Desktop */}
                <div className="hidden md:grid grid-cols-[1.5fr_1.5fr_0.7fr_0.7fr_0.8fr_0.5fr] gap-4 px-5 py-3 items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center">
                      {initials(u.name)}
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {u.name}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600 truncate">
                    {u.email}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full w-fit capitalize ${ROLE_CLS[u.role]}`}
                  >
                    {u.role}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full w-fit capitalize ${STATUS_CLS[status]}`}
                  >
                    {status}
                  </span>
                  <span className="text-xs text-gray-500">
                    {fmt(u.createdAt)}
                  </span>
                  <button
                    onClick={() => handleMessage(u)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    title="Send Message"
                  >
                    <MessageCircle size={16} />
                  </button>
                </div>

                {/* Mobile */}
                <div className="md:hidden p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 text-sm font-bold flex items-center justify-center">
                        {initials(u.name)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">
                          {u.name}
                        </p>
                        <p className="text-xs text-gray-500">{u.email}</p>
                        <div className="flex gap-2 mt-1">
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${ROLE_CLS[u.role]}`}
                          >
                            {u.role}
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_CLS[status]}`}
                          >
                            {status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleMessage(u)}
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <MessageCircle size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-gray-400 text-sm">
            No users found.
          </div>
        )}
      </div>
    </div>
  );
}
