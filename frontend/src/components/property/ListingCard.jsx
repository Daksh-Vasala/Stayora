import {
  Star,
  MapPin,
  Users,
  BedDouble,
  Bath,
  Eye,
  Edit2,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";

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



const ListingCard = ({ listing, handleSoftDelete }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="relative h-44 bg-gray-100">
        <img
          src={listing?.img?.url}
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
            <div key={key} className="flex flex-col items-center">
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
              ₹{listing.price?.toLocaleString()}
            </span>
            <span className="text-xs text-gray-400"> / night</span>
          </div>

          <div className="flex items-center gap-2">
            {/* View */}
            <Link
              to={`/host/listing/${listing.id}`}
              className="group w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-blue-50 transition-all duration-200 cursor-pointer"
            >
              <Eye
                size={15}
                className="text-gray-500 group-hover:text-blue-600 group-hover:scale-110 transition-all"
              />
            </Link>

            {/* Edit */}
            <Link to={`/host/listing/update/${listing.id}`} className="group w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-blue-50 transition-all duration-200 cursor-pointer">
              <Edit2
                size={15}
                className="text-gray-500 group-hover:text-blue-600 group-hover:scale-110 transition-all"
              />
            </Link>

            {/* Delete */}
            <button
              onClick={() => handleSoftDelete(listing.id)}
              className="group w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-red-50 transition-all duration-200 cursor-pointer"
            >
              <Trash2
                size={15}
                className="text-gray-500 group-hover:text-red-500 group-hover:scale-110 transition-all"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default ListingCard;