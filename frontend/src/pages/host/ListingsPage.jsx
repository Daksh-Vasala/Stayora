import { useState, useMemo, memo } from "react";
import {
  Star,
  Plus,
  MapPin,
  Users,
  BedDouble,
  Bath,
  Eye,
  Edit2,
  Trash2,
  Search,
} from "lucide-react";

const LISTINGS = [
  {
    id: 1,
    title: "Luxury Beach Villa",
    type: "villa",
    location: "Goa, India",
    price: 7500,
    rating: 4.8,
    bookings: 12,
    status: "active",
    guests: 6,
    beds: 3,
    baths: 2,
    img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80",
  },
  {
    id: 2,
    title: "Modern City Apartment",
    type: "apartment",
    location: "Mumbai, India",
    price: 4200,
    rating: 4.5,
    bookings: 9,
    status: "active",
    guests: 4,
    beds: 2,
    baths: 1,
    img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=80",
  },
  {
    id: 3,
    title: "Cozy Hill Cottage",
    type: "house",
    location: "Manali, India",
    price: 3500,
    rating: 4.7,
    bookings: 7,
    status: "active",
    guests: 4,
    beds: 2,
    baths: 1,
    img: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=400&q=80",
  },
  {
    id: 4,
    title: "Luxury Penthouse",
    type: "apartment",
    location: "Bangalore, India",
    price: 9500,
    rating: 4.9,
    bookings: 10,
    status: "inactive",
    guests: 8,
    beds: 4,
    baths: 3,
    img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80",
  },
];

const TYPE_COLORS = {
  villa: "bg-purple-100 text-purple-700",
  apartment: "bg-blue-100 text-blue-700",
  house: "bg-green-100 text-green-700",
  studio: "bg-orange-100 text-orange-700",
};

const SPECS = [
  { icon: Users, key: "guests", label: "Guests" },
  { icon: BedDouble, key: "beds", label: "Bedrooms" },
  { icon: Bath, key: "baths", label: "Bathrooms" },
];

const handleImgError = (e) => {
  e.target.parentElement.style.background = "#EEF2FF";
};

const ListingCard = memo(({ listing }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="relative h-44 bg-gray-100">
        <img
          src={listing.img}
          alt={listing.title}
          className="w-full h-full object-cover"
          onError={handleImgError}
        />

        <span
          className={`absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full capitalize ${TYPE_COLORS[listing.type]}`}
        >
          {listing.type}
        </span>

        <span
          className={`absolute top-3 right-3 text-[10px] font-semibold px-2 py-1 rounded-full ${
            listing.status === "active"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {listing.status}
        </span>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm truncate">
              {listing.title}
            </h3>

            <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
              <MapPin size={11} /> {listing.location}
            </p>
          </div>

          <p className="text-xs text-gray-400 flex items-center gap-0.5 shrink-0 font-semibold">
            <Star size={11} className="text-yellow-400 fill-yellow-400" />
            {listing.rating}
          </p>
        </div>

        {/* Specs */}
        <div className="flex items-center gap-4 mt-3 pb-3 border-b border-gray-100">
          {SPECS.map(({ icon: Icon, key, label }) => (
            <div key={label} className="flex flex-col items-center">
              <Icon size={14} className="text-blue-600 mb-0.5" />
              <span className="text-xs font-bold text-gray-900">
                {listing[key]}
              </span>
              <span className="text-[10px] text-gray-400">{label}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-base font-bold text-gray-900">
              ₹{listing.price.toLocaleString()}
            </span>
            <span className="text-xs text-gray-400"> / night</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-blue-50 text-gray-400 hover:text-blue-600 border-none cursor-pointer transition-colors">
              <Eye size={14} />
            </button>

            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-blue-50 text-gray-400 hover:text-blue-600 border-none cursor-pointer transition-colors">
              <Edit2 size={14} />
            </button>

            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 border-none cursor-pointer transition-colors">
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

function ListingsPage() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return LISTINGS.filter((l) =>
      l.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className="space-y-5 p-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">My Listings</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {LISTINGS.length} properties
          </p>
        </div>

        <a
          href="/host/new"
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl no-underline transition-colors shrink-0"
        >
          <Plus size={15} /> New Listing
        </a>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 focus-within:border-blue-400 transition-colors shadow-sm">
        <Search size={15} className="text-gray-400 shrink-0" />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent outline-none text-sm text-gray-800 w-full placeholder:text-gray-400"
          placeholder="Search listings..."
        />
      </div>

      {/* Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((l) => (
          <ListingCard key={l.id} listing={l} />
        ))}
      </div>
    </div>
  );
}

export default ListingsPage;