import { useState, useEffect } from "react";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import axios from "axios";

const STATUS_CONFIG = {
  confirmed: {
    label: "Confirmed",
    cls: "bg-blue-100 text-blue-700",
    icon: CheckCircle,
  },
  pending: {
    label: "Pending",
    cls: "bg-yellow-100 text-yellow-700",
    icon: Clock,
  },
  cancelled: {
    label: "Cancelled",
    cls: "bg-red-100 text-red-600",
    icon: XCircle,
  },
  completed: {
    label: "Completed",
    cls: "bg-green-100 text-green-600",
    icon: CheckCircle,
  },
};

function BookingsPage() {
  const [filter, setFilter] = useState("all");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const tabs = ["all", "confirmed", "pending", "cancelled"];

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get("/bookings"); // adjust baseURL if needed
        setBookings(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });

  const transformedBookings = bookings.map((b) => ({
    id: b._id,
    guest: b.guest?.name || "Unknown",
    property: b.property?.title || "Deleted Property",
    dates: `${formatDate(b.checkIn)} – ${formatDate(b.checkOut)}`,
    amount: `₹${b.totalPrice}`,
    status: b.status,
  }));

  const filtered =
    filter === "all"
      ? transformedBookings
      : transformedBookings.filter((b) => b.status === filter);

  if (loading) {
    return (
      <div className="p-6 text-gray-500 text-sm">
        Loading bookings...
      </div>
    );
  }

  return (
    <div className="space-y-5 p-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Bookings</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          {bookings.length} total bookings
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all border-none cursor-pointer
              ${
                filter === t
                  ? "bg-white text-gray-900 shadow-sm"
                  : "bg-transparent text-gray-500 hover:text-gray-700"
              }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Table — card on mobile */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Desktop header */}
        <div className="hidden sm:grid grid-cols-[1fr_1.2fr_0.8fr_0.8fr_0.9fr] gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wide">
          <span>Guest</span>
          <span>Property</span>
          <span>Dates</span>
          <span>Amount</span>
          <span>Status</span>
        </div>

        {filtered.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">
            No bookings found.
          </div>
        ) : (
          filtered.map((b) => {
            const S = STATUS_CONFIG[b.status];

            return (
              <div
                key={b.id}
                className="hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0"
              >
                {/* Desktop row */}
                <div className="hidden sm:grid grid-cols-[1fr_1.2fr_0.8fr_0.8fr_0.9fr] gap-4 px-5 py-4 items-center">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-[10px] font-bold shrink-0">
                      {b.guest
                        .split(" ")
                        .map((w) => w[0])
                        .join("")}
                    </div>
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {b.guest}
                    </span>
                  </div>

                  <span className="text-sm text-gray-600 truncate">
                    {b.property}
                  </span>

                  <span className="text-sm text-gray-500">
                    {b.dates}
                  </span>

                  <span className="text-sm font-semibold text-gray-900">
                    {b.amount}
                  </span>

                  <span
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-full w-fit ${S?.cls}`}
                  >
                    {S?.label}
                  </span>
                </div>

                {/* Mobile card */}
                <div className="sm:hidden px-4 py-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-[10px] font-bold">
                        {b.guest
                          .split(" ")
                          .map((w) => w[0])
                          .join("")}
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {b.guest}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${S?.cls}`}
                    >
                      {S?.label}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 pl-9">
                    {b.property}
                  </p>

                  <div className="flex items-center justify-between pl-9">
                    <span className="text-xs text-gray-400">
                      {b.dates}
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {b.amount}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default BookingsPage;