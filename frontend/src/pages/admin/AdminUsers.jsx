import { useState } from "react";
import {
  Search,
  UserCheck,
  UserX,
  MoreHorizontal,
  Shield,
  User,
} from "lucide-react";

const USERS = [
  {
    id: 1,
    name: "Priya Sharma",
    email: "priya@email.com",
    role: "guest",
    status: "active",
    joined: "Jan 12, 2024",
    bookings: 8,
  },
  {
    id: 2,
    name: "Raj Shah",
    email: "raj@host.com",
    role: "host",
    status: "active",
    joined: "Feb 3, 2024",
    bookings: 0,
  },
  {
    id: 3,
    name: "Rohan Mehta",
    email: "rohan@email.com",
    role: "guest",
    status: "active",
    joined: "Mar 5, 2024",
    bookings: 4,
  },
  {
    id: 4,
    name: "Anjali Singh",
    email: "anjali@email.com",
    role: "guest",
    status: "blocked",
    joined: "Apr 1, 2024",
    bookings: 2,
  },
  {
    id: 5,
    name: "Vikram Patel",
    email: "vikram@host.com",
    role: "host",
    status: "active",
    joined: "May 8, 2024",
    bookings: 0,
  },
  {
    id: 6,
    name: "Neha Gupta",
    email: "neha@email.com",
    role: "guest",
    status: "active",
    joined: "Jun 20, 2024",
    bookings: 11,
  },
  {
    id: 7,
    name: "Arjun Verma",
    email: "arjun@host.com",
    role: "host",
    status: "pending",
    joined: "Jul 14, 2024",
    bookings: 0,
  },
  {
    id: 8,
    name: "Sneha Kapoor",
    email: "sneha@email.com",
    role: "guest",
    status: "active",
    joined: "Aug 2, 2024",
    bookings: 6,
  },
];

const STATUS_CLS = {
  active: "bg-green-50 text-green-700",
  blocked: "bg-red-50 text-red-600",
  pending: "bg-amber-50 text-amber-700",
};

const ROLE_CLS = {
  guest: "bg-blue-50 text-blue-600",
  host: "bg-purple-50 text-purple-600",
};

export default function AdminUsers() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");

  const list = USERS.filter((u) => {
    const matchQ =
      u.name.toLowerCase().includes(q.toLowerCase()) ||
      u.email.toLowerCase().includes(q.toLowerCase());
    const matchF = filter === "all" || u.role === filter || u.status === filter;
    return matchQ && matchF;
  });

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Users</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          {USERS.length} registered users
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5 flex-1 focus-within:border-blue-400 transition-colors shadow-sm">
          <Search size={14} className="text-gray-300 shrink-0" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name or email..."
            className="bg-transparent outline-none text-sm text-gray-800 w-full placeholder:text-gray-300"
          />
        </div>
        <div className="flex gap-1.5">
          {["all", "guest", "host", "blocked"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all border-none cursor-pointer
                ${filter === f ? "bg-blue-600 text-white" : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-200"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="hidden md:grid grid-cols-[1.5fr_1.5fr_0.7fr_0.7fr_0.8fr_0.5fr] gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wide">
          <span>User</span>
          <span>Email</span>
          <span>Role</span>
          <span>Status</span>
          <span>Joined</span>
          <span></span>
        </div>

        <div className="divide-y divide-gray-50">
          {list.map((u) => (
            <div key={u.id} className="hover:bg-gray-50/40 transition-colors">
              {/* Desktop */}
              <div className="hidden md:grid grid-cols-[1.5fr_1.5fr_0.7fr_0.7fr_0.8fr_0.5fr] gap-4 px-5 py-3.5 items-center">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center shrink-0">
                    {u.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")}
                  </div>
                  <span className="text-sm font-semibold text-gray-900 truncate">
                    {u.name}
                  </span>
                </div>
                <span className="text-sm text-gray-500 truncate">
                  {u.email}
                </span>
                <span
                  className={`text-[11px] font-bold px-2 py-1 rounded-full capitalize w-fit ${ROLE_CLS[u.role]}`}
                >
                  {u.role}
                </span>
                <span
                  className={`text-[11px] font-semibold px-2 py-1 rounded-full capitalize w-fit ${STATUS_CLS[u.status]}`}
                >
                  {u.status}
                </span>
                <span className="text-xs text-gray-400">{u.joined}</span>
                <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 border-none cursor-pointer transition-colors">
                  <MoreHorizontal size={14} />
                </button>
              </div>

              {/* Mobile */}
              <div className="md:hidden flex items-center justify-between px-5 py-4 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center shrink-0">
                    {u.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {u.name}
                    </p>
                    <p className="text-[11px] text-gray-400">{u.email}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${ROLE_CLS[u.role]}`}
                  >
                    {u.role}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${STATUS_CLS[u.status]}`}
                  >
                    {u.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {list.length === 0 && (
          <div className="py-12 text-center text-sm text-gray-400">
            No users found.
          </div>
        )}
      </div>
    </div>
  );
}
