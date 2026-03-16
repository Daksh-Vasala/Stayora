import React, { memo } from "react";
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
} from "lucide-react";

// ── Mock data ─────────────────────────────────────────────────────────────────
const STATS = [
  {
    label: "Total Earnings",
    value: "₹1,24,500",
    change: "+12.4%",
    up: true,
    icon: DollarSign,
  },
  { label: "Active Listings", value: "6", change: "+2", up: true, icon: List },
  {
    label: "Total Bookings",
    value: "38",
    change: "+5",
    up: true,
    icon: CheckCircle,
  },
  { label: "Avg. Rating", value: "4.8", change: "-0.1", up: false, icon: Star },
];

const LISTINGS = [
  {
    id: 1,
    title: "Luxury Beach Villa",
    location: "Goa, India",
    price: 7500,
    rating: 4.8,
    bookings: 12,
    img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80",
  },
  {
    id: 2,
    title: "Modern City Apartment",
    location: "Mumbai, India",
    price: 4200,
    rating: 4.5,
    bookings: 9,
    img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=80",
  },
  {
    id: 3,
    title: "Cozy Hill Cottage",
    location: "Manali, India",
    price: 3500,
    rating: 4.7,
    bookings: 7,
    img: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=400&q=80",
  },
];

const BOOKINGS = [
  {
    id: "BK001",
    guest: "Priya Sharma",
    property: "Luxury Beach Villa",
    dates: "Dec 24–28",
    amount: "₹30,000",
    status: "confirmed",
  },
  {
    id: "BK002",
    guest: "Rohan Mehta",
    property: "Modern City Apartment",
    dates: "Dec 26–29",
    amount: "₹12,600",
    status: "pending",
  },
  {
    id: "BK003",
    guest: "Anjali Singh",
    property: "Cozy Hill Cottage",
    dates: "Jan 1–5",
    amount: "₹14,000",
    status: "confirmed",
  },
];

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
};

// ── Prevent image rerender handler recreation
const handleImgError = (e) => {
  e.target.style.display = "none";
};

// ── Stat Card ─────────────────────────────────────────────────
const StatCard = memo(({ label, value, change, up, Icon }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
          <Icon size={15} className="text-blue-600" />
        </div>
      </div>

      <p className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
        {value}
      </p>

      <p
        className={`text-xs font-semibold mt-1.5 flex items-center gap-1 ${
          up ? "text-green-600" : "text-red-500"
        }`}
      >
        {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        {change} this month
      </p>
    </div>
  );
});

// ── Booking Row ─────────────────────────────────────────────────
const BookingRow = memo(({ booking }) => {
  const S = STATUS_CONFIG[booking.status];

  return (
    <div className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/50 transition-colors">
      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-[11px] font-bold shrink-0">
        {booking.guest
          .split(" ")
          .map((w) => w[0])
          .join("")}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">
          {booking.guest}
        </p>

        <p className="text-xs text-gray-400 truncate">
          {booking.property} · {booking.dates}
        </p>
      </div>

      <div className="text-right shrink-0">
        <p className="text-sm font-bold text-gray-900">{booking.amount}</p>

        <span
          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${S.cls}`}
        >
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
        src={listing.img}
        alt={listing.title}
        className="w-10 h-10 rounded-xl object-cover shrink-0"
        onError={handleImgError}
      />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">
          {listing.title}
        </p>

        <p className="text-xs text-gray-400">
          ₹{listing.price.toLocaleString()}/night
        </p>
      </div>

      <div className="shrink-0 text-right">
        <p className="text-xs font-bold text-gray-900 flex items-center gap-0.5 justify-end">
          <Star size={11} className="text-yellow-400 fill-yellow-400" />
          {listing.rating}
        </p>

        <p className="text-[11px] text-gray-400">
          {listing.bookings} bookings
        </p>
      </div>
    </div>
  );
});

// ── Dashboard Page ─────────────────────────────────────────────
export default function HostDashboard() {
  return (
    <div className="space-y-6 p-6">
      {/* Welcome */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">
          Good morning, Raj 👋
        </h1>

        <p className="text-sm text-gray-400 mt-0.5">
          Here's what's happening with your properties.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {STATS.map((stat) => (
          <StatCard key={stat.label} {...stat} Icon={stat.icon} />
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Bookings */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">
              Recent Bookings
            </h3>

            <button className="text-xs text-blue-600 font-semibold hover:underline border-none bg-transparent cursor-pointer flex items-center gap-0.5">
              View all <ChevronRight size={13} />
            </button>
          </div>

          <div className="divide-y divide-gray-50">
            {BOOKINGS.map((b) => (
              <BookingRow key={b.id} booking={b} />
            ))}
          </div>
        </div>

        {/* Listings */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">
              Top Listings
            </h3>
          </div>

          <div className="divide-y divide-gray-50">
            {LISTINGS.map((l) => (
              <ListingRow key={l.id} listing={l} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}