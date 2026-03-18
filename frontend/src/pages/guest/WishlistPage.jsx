import { useState, useRef, useEffect } from "react";
import {
  Heart,
  MapPin,
  Star,
  Users,
  BedDouble,
  Bath,
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





const TYPE_COLOR = {
  villa: "bg-blue-600",
  apartment: "bg-blue-500",
  house: "bg-blue-700",
  studio: "bg-blue-400",
};

export default function WishlistPage() {
  const [saved, setSaved] = useState([1, 2, 3, 4, 5, 6]);

  const remove = (id) => setSaved((s) => s.filter((x) => x !== id));
  const props = PROPERTIES.filter((p) => saved.includes(p.id));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Wishlist
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          {props.length} saved properties
        </p>
      </div>

      {props.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center">
            <Heart size={22} className="text-gray-300" />
          </div>
          <p className="text-sm font-semibold text-gray-500">
            No saved properties
          </p>
          <p className="text-xs text-gray-300">
            Tap the heart on any listing to save it here
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {props.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
            >
              {/* Image */}
              <div className="relative h-44 bg-gray-100 overflow-hidden">
                <img
                  src={p.img}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
                {/* Type badge */}
                <span
                  className={`absolute top-3 left-3 text-white text-[10px] font-bold px-2.5 py-1 rounded-full capitalize ${TYPE_COLOR[p.type]}`}
                >
                  {p.type}
                </span>
                {/* Remove from wishlist */}
                <button
                  onClick={() => remove(p.id)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm hover:scale-110 transition-all border-none cursor-pointer"
                >
                  <Heart size={14} className="text-red-500 fill-red-500" />
                </button>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-[13.5px] font-bold text-gray-900 leading-tight truncate">
                    {p.title}
                  </h3>
                  <div className="flex items-center gap-0.5 shrink-0">
                    <Star
                      size={11}
                      className="text-yellow-400 fill-yellow-400"
                    />
                    <span className="text-[12px] font-semibold text-gray-700">
                      {p.rating}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-gray-400 flex items-center gap-1 mb-3">
                  <MapPin size={10} className="shrink-0" /> {p.loc}
                </p>

                {/* Specs */}
                <div className="flex items-center gap-3 pb-3 border-b border-gray-50 mb-3">
                  {[
                    { I: Users, v: p.guests, l: "Guests" },
                    { I: BedDouble, v: p.beds, l: "Beds" },
                    { I: Bath, v: p.baths, l: "Baths" },
                  ].map(({ I, v, l }) => (
                    <div key={l} className="flex flex-col items-center flex-1">
                      <I size={13} className="text-blue-600 mb-0.5" />
                      <span className="text-[11px] font-bold text-gray-900">
                        {v}
                      </span>
                      <span className="text-[9px] text-gray-400">{l}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-base font-bold text-gray-900">
                      ₹{p.price.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-gray-400"> /night</span>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-bold px-4 py-2 rounded-xl border-none cursor-pointer transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}