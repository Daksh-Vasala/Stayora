import { Link } from "react-router-dom";
import {
  MapPin,
  Users,
  Bed,
  Bath,
  Star,
  Heart,
  ShieldCheck,
} from "lucide-react";
import { memo } from "react";

function PropertyCard({ property }) {
  const {
    title,
    description,
    propertyType,
    pricePerNight,
    location,
    maxGuests,
    bedrooms,
    bathrooms,
    images = [],
    host,
    rating = 4.5,
    reviews = 120,
  } = property;

  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(pricePerNight);

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="relative h-56 overflow-hidden">
        <img
          src={images[0]?.url || "/placeholder-property.jpg"}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
            {propertyType}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-semibold text-slate-900">
              {rating}
            </span>
            <span className="text-xs text-slate-500">({reviews})</span>
          </div>
        </div>

        <p className="text-sm text-slate-600 line-clamp-2 mb-4">
          {description}
        </p>

        <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
          <MapPin className="w-4 h-4 text-slate-400" />
          <span className="line-clamp-1">
            {location?.city}, {location?.country}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 py-4 border-y border-slate-100 mb-4">
          <div className="flex flex-col items-center">
            <Users className="w-5 h-5 text-blue-600 mb-1" />
            <span className="text-xs text-slate-500">Guests</span>
            <span className="text-sm font-semibold text-slate-900">
              {maxGuests}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <Bed className="w-5 h-5 text-blue-600 mb-1" />
            <span className="text-xs text-slate-500">Bedrooms</span>
            <span className="text-sm font-semibold text-slate-900">
              {bedrooms}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <Bath className="w-5 h-5 text-blue-600 mb-1" />
            <span className="text-xs text-slate-500">Bathrooms</span>
            <span className="text-sm font-semibold text-slate-900">
              {bathrooms}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-linear-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
            {host?.name?.charAt(0) || "H"}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-900">
              Hosted by {host?.name || "Verified Host"}
            </p>
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-green-500" />
              <span className="text-xs text-slate-500">Verified</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-slate-900">
              {formattedPrice}
            </span>
            <span className="text-sm text-slate-500"> / night</span>
          </div>
          <Link
            to={`/property/${property?._id}`}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors shadow-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default memo(PropertyCard);