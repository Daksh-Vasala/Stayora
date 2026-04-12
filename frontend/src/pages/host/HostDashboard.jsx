// HostDashboard.jsx - Dynamic with API
import { memo, useState, useEffect } from "react";
import {
  DollarSign,
  List,
  Star,
  CheckCircle,
  Clock,
  XCircle,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Home,
  Calendar,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

const STATUS_CONFIG = {
  confirmed: {
    label: "Confirmed",
    cls: "bg-green-100 text-green-700",
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
    cls: "bg-blue-100 text-blue-600",
    icon: CheckCircle,
  },
};

// ── Stat Card ─────────────────────────────────────────────────
const StatCard = memo(({ label, value, change, up, Icon }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
          <Icon size={15} className="text-blue-600" />
        </div>
      </div>

      <p className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
        {value}
      </p>

      {change && (
        <p
          className={`text-xs font-semibold mt-1.5 flex items-center gap-1 ${
            up ? "text-green-600" : "text-red-500"
          }`}
        >
          {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {change} this month
        </p>
      )}
    </div>
  );
});

// ── Booking Row ─────────────────────────────────────────────────
const BookingRow = memo(({ booking }) => {
  const S = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;
  const Icon = S.icon;

  // Format dates nicely
  const formatDates = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${end.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
  };

  return (
    <div className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/50 transition-colors">
      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-[11px] font-bold shrink-0">
        {booking.guest?.name
          ?.split(" ")
          .map((w) => w[0])
          .join("") || "G"}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">
          {booking.guest?.name || "Guest"}
        </p>

        <p className="text-xs text-gray-400 truncate">
          {booking.property?.title || "Property"} ·{" "}
          {formatDates(booking.checkIn, booking.checkOut)}
        </p>
      </div>

      <div className="text-right shrink-0">
        <p className="text-sm font-bold text-gray-900">
          ₹{booking.totalPrice?.toLocaleString()}
        </p>

        <span
          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${S.cls} flex items-center gap-0.5 justify-end`}
        >
          <Icon size={10} />
          {S.label}
        </span>
      </div>
    </div>
  );
});

// ── Listing Row ─────────────────────────────────────────────────
const ListingRow = memo(({ listing }) => {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50/50 transition-colors">
      <img
        src={listing.images?.[0] || listing.img}
        alt={listing.title}
        className="w-10 h-10 rounded-xl object-cover shrink-0"
        onError={(e) => (e.target.style.display = "none")}
      />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">
          {listing.title}
        </p>

        <p className="text-xs text-gray-400">
          ₹{listing.pricePerNight?.toLocaleString()}/night
        </p>
      </div>

      <div className="shrink-0 text-right">
        <p className="text-xs font-bold text-gray-900 flex items-center gap-0.5 justify-end">
          <Star size={11} className="text-yellow-400 fill-yellow-400" />
          {listing.averageRating || listing.rating || "4.0"}
        </p>

        <p className="text-[11px] text-gray-400">
          {listing.totalBookings || 0} bookings
        </p>
      </div>
    </div>
  );
});

// ── Main Dashboard Component ─────────────────────────────────────────────
export default function HostDashboard() {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [topListings, setTopListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [statsRes, bookingsRes, listingsRes] = await Promise.all([
        axios.get("host/dashboard/stats"),
        axios.get("host/bookings?limit=3"),
        axios.get("host/properties/top?limit=3"),
      ]);
      console.log(statsRes.data);
      console.log(listingsRes.data);
      console.log(bookingsRes.data);
      setStats(statsRes.data);
      setRecentBookings(bookingsRes.data);
      setTopListings(listingsRes.data);
    } catch (error) {
      console.error("Error fetching dashboard:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-3 text-blue-500 hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Welcome */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">{getGreeting()} 👋</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Here's what's happening with your properties.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          label="Total Earnings"
          value={`₹${stats?.totalEarnings?.toLocaleString() || "0"}`}
          change={stats?.earningsChange}
          up={stats?.earningsChange > 0}
          Icon={DollarSign}
        />
        <StatCard
          label="Active Listings"
          value={stats?.activeListings || 0}
          change={stats?.listingsChange}
          up={stats?.listingsChange > 0}
          Icon={List}
        />
        <StatCard
          label="Total Bookings"
          value={stats?.totalBookings || 0}
          change={stats?.bookingsChange}
          up={stats?.bookingsChange > 0}
          Icon={CheckCircle}
        />
        <StatCard
          label="Avg. Rating"
          value={stats?.averageRating?.toFixed(1) || "0.0"}
          change={stats?.ratingChange}
          up={stats?.ratingChange > 0}
          Icon={Star}
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Recent Bookings */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">
              Recent Bookings
            </h3>

            <Link
              to="/host/bookings"
              className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-0.5"
            >
              View all <ChevronRight size={13} />
            </Link>
          </div>

          <div className="divide-y divide-gray-50">
            {recentBookings.bookings.length === 0 ? (
              <div className="px-5 py-8 text-center text-gray-400 text-sm">
                No bookings yet
              </div>
            ) : (
              recentBookings.bookings.map((booking) => (
                <BookingRow key={booking._id || booking.id} booking={booking} />
              ))
            )}
          </div>
        </div>

        {/* Top Listings */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">
              Top Listings
            </h3>
          </div>

          <div className="divide-y divide-gray-50">
            {topListings.length === 0 ? (
              <div className="px-5 py-8 text-center text-gray-400 text-sm">
                No properties yet
              </div>
            ) : (
              topListings.map((listing) => (
                <ListingRow key={listing._id || listing.id} listing={listing} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
