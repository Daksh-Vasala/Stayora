import { useState } from "react";
import {
  MapPin,
  Star,
  BookOpen,
  XCircle,
  Calendar,
  Tag,
  Eye,
} from "lucide-react";

// ══════════════════════════════════════════════════════════════════════════════
//  SHARED DATA
// ══════════════════════════════════════════════════════════════════════════════

const PROPERTIES = [
  {
    id: 1,
    title: "Luxury Beach Villa",
    type: "villa",
    loc: "Goa, India",
    price: 7500,
    rating: 4.8,
    reviews: 120,
    guests: 6,
    beds: 3,
    baths: 2,
    img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80",
    desc: "Beautiful beachside villa with sunset views and private pool.",
  },
  {
    id: 2,
    title: "Modern City Apartment",
    type: "apartment",
    loc: "Mumbai, India",
    price: 4200,
    rating: 4.5,
    reviews: 120,
    guests: 4,
    beds: 2,
    baths: 1,
    img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80",
    desc: "Stylish apartment in the heart of Mumbai.",
  },
  {
    id: 3,
    title: "Cozy Hill Cottage",
    type: "house",
    loc: "Manali, India",
    price: 3500,
    rating: 4.7,
    reviews: 120,
    guests: 4,
    beds: 2,
    baths: 1,
    img: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=600&q=80",
    desc: "Perfect mountain retreat with scenic views.",
  },
  {
    id: 4,
    title: "Luxury Penthouse",
    type: "apartment",
    loc: "Bangalore, India",
    price: 9500,
    rating: 4.9,
    reviews: 120,
    guests: 8,
    beds: 4,
    baths: 3,
    img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
    desc: "Top floor penthouse with skyline view.",
  },
  {
    id: 5,
    title: "Studio Loft",
    type: "studio",
    loc: "Pune, India",
    price: 2800,
    rating: 4.6,
    reviews: 84,
    guests: 2,
    beds: 1,
    baths: 1,
    img: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600&q=80",
    desc: "Chic studio in the heart of the city.",
  },
  {
    id: 6,
    title: "Heritage Haveli",
    type: "villa",
    loc: "Jaipur, India",
    price: 6200,
    rating: 4.8,
    reviews: 96,
    guests: 8,
    beds: 4,
    baths: 3,
    img: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&q=80",
    desc: "Royal heritage property with courtyard.",
  },
];

const BOOKINGS = [
  {
    id: "BK001",
    propId: 1,
    dates: "Dec 24 – Dec 28, 2024",
    nights: 4,
    total: 30000,
    status: "confirmed",
    booked: "Dec 10, 2024",
  },
  {
    id: "BK002",
    propId: 2,
    dates: "Jan 5 – Jan 8, 2025",
    nights: 3,
    total: 12600,
    status: "pending",
    booked: "Dec 15, 2024",
  },
  {
    id: "BK003",
    propId: 3,
    dates: "Jan 15 – Jan 20, 2025",
    nights: 5,
    total: 17500,
    status: "completed",
    booked: "Nov 20, 2024",
  },
  {
    id: "BK004",
    propId: 4,
    dates: "Feb 1 – Feb 3, 2025",
    nights: 2,
    total: 19000,
    status: "cancelled",
    booked: "Dec 1, 2024",
  },
];

const TYPE_COLOR = {
  villa: "bg-blue-600",
  apartment: "bg-blue-500",
  house: "bg-blue-700",
  studio: "bg-blue-400",
};

const STATUS = {
  confirmed: {
    label: "Confirmed",
    cls: "bg-green-50 text-green-700",
    dot: "bg-green-500",
  },
  pending: {
    label: "Pending",
    cls: "bg-amber-50 text-amber-700",
    dot: "bg-amber-400",
  },
  completed: {
    label: "Completed",
    cls: "bg-gray-100 text-gray-600",
    dot: "bg-gray-400",
  },
  cancelled: {
    label: "Cancelled",
    cls: "bg-red-50 text-red-600",
    dot: "bg-red-400",
  },
};
// ══════════════════════════════════════════════════════════════════════════════
//  MY BOOKINGS PAGE
// ══════════════════════════════════════════════════════════════════════════════
export default function GuestBookingsPage() {
  const [tab, setTab] = useState("all");
  const tabs = ["all", "confirmed", "pending", "completed", "cancelled"];

  const list =
    tab === "all" ? BOOKINGS : BOOKINGS.filter((b) => b.status === tab);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          My Bookings
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          {BOOKINGS.length} total bookings
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none] pb-1 mb-6">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`shrink-0 px-4 py-2 rounded-xl text-[12.5px] font-semibold capitalize transition-all border-none cursor-pointer
              ${tab === t ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Booking cards */}
      {list.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center">
            <BookOpen size={22} className="text-gray-300" />
          </div>
          <p className="text-sm font-semibold text-gray-500">
            No bookings found
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {list.map((b) => {
            const prop = PROPERTIES.find((p) => p.id === b.propId);
            const S = STATUS[b.status];

            return (
              <div
                key={b.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Image */}
                  <div className="relative sm:w-44 h-40 sm:h-auto bg-gray-100 shrink-0">
                    <img
                      src={prop.img}
                      alt={prop.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                    <span
                      className={`absolute top-3 left-3 text-white text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${TYPE_COLOR[prop.type]}`}
                    >
                      {prop.type}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">
                          {b.id}
                        </p>
                        <h3 className="text-[15px] font-bold text-gray-900 truncate">
                          {prop.title}
                        </h3>
                        <p className="text-[12px] text-gray-400 flex items-center gap-1 mt-1">
                          <MapPin size={10} className="shrink-0" /> {prop.loc}
                        </p>
                      </div>
                      {/* Status badge */}
                      <span
                        className={`shrink-0 flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${S.cls}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${S.dot}`} />
                        {S.label}
                      </span>
                    </div>

                    {/* Meta row */}
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
                      <div className="flex items-center gap-1.5 text-[12px] text-gray-500">
                        <Calendar size={12} className="text-blue-500" />
                        {b.dates}
                      </div>
                      <div className="flex items-center gap-1.5 text-[12px] text-gray-500">
                        <Tag size={12} className="text-blue-500" />
                        {b.nights} night{b.nights > 1 ? "s" : ""}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-50">
                      <div>
                        <span className="text-[11px] text-gray-400">
                          Total paid{" "}
                        </span>
                        <span className="text-[15px] font-bold text-gray-900">
                          ₹{b.total.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {b.status === "completed" && (
                          <button className="flex items-center gap-1.5 text-[12px] font-semibold text-blue-600 hover:text-blue-700 border border-blue-200 hover:bg-blue-50 px-3 py-1.5 rounded-xl cursor-pointer bg-transparent transition-colors">
                            <Star size={12} /> Review
                          </button>
                        )}
                        {b.status === "confirmed" && (
                          <button className="flex items-center gap-1.5 text-[12px] font-semibold text-red-500 hover:text-red-600 border border-red-100 hover:bg-red-50 px-3 py-1.5 rounded-xl cursor-pointer bg-transparent transition-colors">
                            <XCircle size={12} /> Cancel
                          </button>
                        )}
                        <button className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-bold px-4 py-1.5 rounded-xl border-none cursor-pointer transition-colors">
                          <Eye size={12} /> View
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
