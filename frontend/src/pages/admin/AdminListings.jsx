import { useState } from "react";
import {
  Search,
  MapPin,
  Star,
  Eye,
  Trash2,
  MoreHorizontal,
} from "lucide-react";

const LISTINGS = [
  {
    id: 1,
    title: "Luxury Beach Villa",
    type: "villa",
    city: "Goa",
    host: "Raj Shah",
    price: 12500,
    rating: 4.9,
    status: "active",
    img: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=200&q=60",
  },
  {
    id: 2,
    title: "Cozy Studio Bandra",
    type: "studio",
    city: "Mumbai",
    host: "Raj Shah",
    price: 3200,
    rating: 4.6,
    status: "active",
    img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=200&q=60",
  },
  {
    id: 3,
    title: "Royal Heritage Haveli",
    type: "house",
    city: "Jaipur",
    host: "Raj Shah",
    price: 8900,
    rating: 4.8,
    status: "active",
    img: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=200&q=60",
  },
  {
    id: 4,
    title: "Mountain View Cabin",
    type: "house",
    city: "Manali",
    host: "Raj Shah",
    price: 5500,
    rating: 4.7,
    status: "inactive",
    img: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=200&q=60",
  },
  {
    id: 5,
    title: "Koramangala 3BHK",
    type: "apartment",
    city: "Bangalore",
    host: "Raj Shah",
    price: 6200,
    rating: 4.5,
    status: "active",
    img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=200&q=60",
  },
  {
    id: 6,
    title: "Lakeside Villa",
    type: "villa",
    city: "Srinagar",
    host: "Vikram Patel",
    price: 14000,
    rating: 4.9,
    status: "active",
    img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&q=60",
  },
  {
    id: 7,
    title: "Modern Penthouse",
    type: "apartment",
    city: "Gurugram",
    host: "Vikram Patel",
    price: 18000,
    rating: 4.8,
    status: "active",
    img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200&q=60",
  },
  {
    id: 8,
    title: "Treehouse Studio",
    type: "studio",
    city: "Munnar",
    host: "Vikram Patel",
    price: 7200,
    rating: 4.9,
    status: "active",
    img: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=200&q=60",
  },
];

const TYPE_CLS = {
  villa: "bg-purple-50 text-purple-700",
  apartment: "bg-blue-50 text-blue-700",
  house: "bg-green-50 text-green-700",
  studio: "bg-orange-50 text-orange-700",
};
const STATUS_CLS = {
  active: "bg-green-50 text-green-700",
  inactive: "bg-gray-100 text-gray-500",
};

export default function AdminListings() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");

  const list = LISTINGS.filter((l) => {
    const matchQ =
      l.title.toLowerCase().includes(q.toLowerCase()) ||
      l.city.toLowerCase().includes(q.toLowerCase());
    const matchF = filter === "all" || l.type === filter || l.status === filter;
    return matchQ && matchF;
  });

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Listings</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          {LISTINGS.length} total properties
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5 flex-1 focus-within:border-blue-400 transition-colors shadow-sm">
          <Search size={14} className="text-gray-300 shrink-0" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search title or city..."
            className="bg-transparent outline-none text-sm text-gray-800 w-full placeholder:text-gray-300"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {["all", "villa", "apartment", "house", "studio", "inactive"].map(
            (f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all border-none cursor-pointer
                ${filter === f ? "bg-blue-600 text-white" : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-200"}`}
              >
                {f}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {list.map((l) => (
          <div
            key={l.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="relative h-36 bg-gray-100">
              <img
                src={l.img}
                alt={l.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <span
                className={`absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${TYPE_CLS[l.type]}`}
              >
                {l.type}
              </span>
              <span
                className={`absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_CLS[l.status]}`}
              >
                {l.status}
              </span>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="text-[13.5px] font-bold text-gray-900 truncate">
                  {l.title}
                </h3>
                <div className="flex items-center gap-0.5 shrink-0">
                  <Star size={11} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-xs font-bold text-gray-700">
                    {l.rating}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-gray-400 flex items-center gap-1 mb-3">
                <MapPin size={10} className="text-blue-400 shrink-0" />
                {l.city} · by {l.host}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-900">
                  ₹{l.price.toLocaleString()}{" "}
                  <span className="text-xs text-gray-400 font-normal">
                    /night
                  </span>
                </span>
                <div className="flex items-center gap-1">
                  <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-blue-50 text-gray-400 hover:text-blue-600 border-none cursor-pointer transition-colors">
                    <Eye size={13} />
                  </button>
                  <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 border-none cursor-pointer transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {list.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 py-12 text-center text-sm text-gray-400 shadow-sm">
          No listings found.
        </div>
      )}
    </div>
  );
}
