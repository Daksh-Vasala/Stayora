import { memo } from "react";
import { MapPin, Star, Eye, Trash2 } from "lucide-react";
import axios from "axios";

const TYPE_CLS = {
  villa: "bg-purple-50 text-purple-700",
  apartment: "bg-blue-50 text-blue-700",
  house: "bg-green-50 text-green-700",
  studio: "bg-orange-50 text-orange-700",
};

// 🔥 VISIBILITY STATUS
const STATUS_CLS = {
  active: "bg-green-50 text-green-700",
  inactive: "bg-gray-100 text-gray-500",
};

// 🔥 APPROVAL STATUS (NEW)
const APPROVAL_CLS = {
  pending: "bg-yellow-50 text-yellow-700",
  approved: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-700",
};

const AdminPropertyCard = memo(({ property, onView, onDelete }) => {
  const isDeleted = property.isDeleted;
  const status = property.status;
  const approval = property.approvalStatus;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-36 bg-gray-100">
        <img
          src={
            property.images?.[0]?.url ||
            "https://placehold.co/400x200?text=No+Image"
          }
          alt={property.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Property Type */}
        <span
          className={`absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${TYPE_CLS[property.propertyType]}`}
        >
          {property.propertyType}
        </span>

        {/* 🔥 Approval Badge (PRIMARY for admin) */}
        <span
          className={`absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${APPROVAL_CLS[approval]}`}
        >
          {approval}
        </span>

        {/* 🔥 Deleted overlay */}
        {isDeleted && (
          <span className="absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
            deleted
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-[13.5px] font-bold text-gray-900 truncate">
            {property.title}
          </h3>

          <div className="flex items-center gap-0.5 shrink-0">
            <Star size={11} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-bold text-gray-700">
              {property.rating > 0 ? property.rating : "New"}
            </span>
          </div>
        </div>

        <p className="text-[11px] text-gray-400 flex items-center gap-1 mb-3">
          <MapPin size={10} className="text-blue-400 shrink-0" />
          {property.location.city} · by {property.host.name}
        </p>

        {/* 🔥 Visibility status (secondary info) */}
        <div className="mb-3">
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_CLS[status]}`}
          >
            {status}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-gray-900">
            ₹{property.pricePerNight.toLocaleString()}{" "}
            <span className="text-xs text-gray-400 font-normal">
              /night
            </span>
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onView?.(property._id)}
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"
              aria-label="View property"
            >
              <Eye size={13} />
            </button>

            {!isDeleted && (
              <button
                onClick={() => onDelete?.(property._id)}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                aria-label="Delete property"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default AdminPropertyCard;