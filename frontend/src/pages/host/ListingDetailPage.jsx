import { useEffect, useState } from "react";
import {
  Star,
  MapPin,
  Users,
  BedDouble,
  Bath,
  Bed,
  Wifi,
  Car,
  Wind,
  Waves,
  Tv,
  UtensilsCrossed,
  Shield,
  Flame,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const AMENITY_MAP = {
  wifi: { label: "Wi-Fi", Icon: Wifi },
  parking: { label: "Parking", Icon: Car },
  ac: { label: "AC", Icon: Wind },
  pool: { label: "Pool", Icon: Waves },
  kitchen: { label: "Kitchen", Icon: UtensilsCrossed },
  tv: { label: "TV", Icon: Tv },
  heater: { label: "Heater", Icon: Flame },
  security: { label: "Security", Icon: Shield },
};

const TYPE_COLOR = {
  villa: "bg-blue-600",
  apartment: "bg-blue-500",
  house: "bg-blue-700",
  studio: "bg-blue-400",
};

// ── Gallery Component ──
function Gallery({ images }) {
  const [idx, setIdx] = useState(0);
  if (!images?.length) return null;

  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);

  return (
    <div className="relative w-full">
      <div className="relative h-64 sm:h-80 lg:h-96 bg-gray-100 rounded-2xl overflow-hidden">
        <img
          src={images[idx]?.url}
          alt=""
          className="w-full h-full object-cover"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow hover:bg-white transition-colors"
            >
              ◀
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow hover:bg-white transition-colors"
            >
              ▶
            </button>
            <span className="absolute bottom-3 right-3 bg-black/50 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
              {idx + 1} / {images.length}
            </span>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto [scrollbar-width:none]">
          {images.map((img, i) => (
            <button
              key={img.public_id}
              onClick={() => setIdx(i)}
              className={`shrink-0 w-16 h-12 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${i === idx ? "border-blue-600" : "border-transparent opacity-60 hover:opacity-100"}`}
            >
              <img
                src={img.url}
                alt=""
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Listing Detail Page ──
export default function ListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [tab, setTab] = useState("overview");

  const fetchProperty = async () => {
    try {
      const res = await axios.get(`/property/${id}`);
      setListing(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProperty();
  }, [id]);

  if (!listing)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );

  const isActive = listing.status === "active";

  const handleSoftDelete = async () => {
    try {
      const isConfirm = window.confirm("Do you want to delete this?");
      if (isConfirm) {
        console.log(id);
        await axios.patch(`/property/delete/${id}`);
        navigate("/host/listings");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStatus = async () => {
    try {
      const newStatus = isActive ? "inactive" : "active";

      await axios.patch(`/property/deactivate/${id}`, {
        status: newStatus,
      });

      fetchProperty(); // refresh UI
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        {/* Gallery + Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-3">
            <Gallery images={listing.images} />
          </div>

          <div className="lg:col-span-2 flex flex-col gap-3">
            {/* Title Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between gap-2 mb-1">
                <span
                  className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-full capitalize ${TYPE_COLOR[listing.propertyType]}`}
                >
                  {listing.propertyType}
                </span>
                <div className="flex items-center gap-1">
                  <Star size={13} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-bold text-gray-900">
                    {listing.rating}
                  </span>
                  <span className="text-xs text-gray-400">
                    ({listing.reviewCount})
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isActive
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <h2 className="text-base font-bold text-gray-900 mt-1 mb-1">
                {listing.title}
              </h2>
              <p className="text-[12px] text-gray-400 flex items-center gap-1">
                <MapPin size={11} className="shrink-0 text-blue-500" />
                {listing.location.address}
              </p>
              <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
                <span className="text-xl font-bold text-gray-900">
                  ₹{listing.pricePerNight.toLocaleString()}
                </span>
                <span className="text-xs text-gray-400">/ night</span>
              </div>
            </div>

            {/* Specs */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="grid grid-cols-4 gap-2">
                {[
                  { Icon: Users, val: listing.maxGuests, label: "Guests" },
                  { Icon: BedDouble, val: listing.bedrooms, label: "Rooms" },
                  { Icon: Bed, val: listing.beds, label: "Beds" },
                  { Icon: Bath, val: listing.bathrooms, label: "Baths" },
                ].map(({ Icon, val, label }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-1 py-2"
                  >
                    <Icon size={15} className="text-blue-600" />
                    <span className="text-sm font-bold text-gray-900">
                      {val}
                    </span>
                    <span className="text-[10px] text-gray-400">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-gray-100 rounded-2xl p-1 shadow-sm w-fit">
          {["overview", "amenities", "bookings"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-[12.5px] font-semibold capitalize transition-all border-none cursor-pointer
                ${tab === t ? "bg-blue-600 text-white" : "bg-transparent text-gray-500 hover:text-gray-800"}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── Tab content ── */}
        {tab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-3">
                About this property
              </h3>
              <p className="text-[13.5px] text-gray-600 leading-relaxed">
                {listing?.description}
              </p>
              <div className="mt-4 pt-4 border-t border-gray-50 grid grid-cols-2 gap-2 text-[12px]">
                {[
                  ["Property ID", listing?._id.slice(-8).toUpperCase()],
                  ["Type", listing?.propertyType],
                  [
                    "Location",
                    `${listing?.location?.city}, ${listing?.location?.country}`,
                  ],
                  [
                    "Listed on",
                    new Date(listing?.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }),
                  ],
                ].map(([k, v]) => (
                  <div key={k} className="flex flex-col gap-0.5">
                    <span className="text-gray-400 font-medium">{k}</span>
                    <span className="text-gray-800 font-semibold capitalize">
                      {v}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Danger zone */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
              <h3 className="text-sm mb-5 font-bold text-gray-900">Manage</h3>
              <button
                onClick={handleToggleStatus}
                className={`w-full flex items-center gap-2 justify-center py-2.5 rounded-xl text-sm font-semibold border transition-colors cursor-pointer
                  ${
                    isActive
                      ? "border-yellow-100 text-yellow-600 hover:bg-yellow-50"
                      : "border-green-100 text-green-600 hover:bg-green-50"
                  }`}
              >
                {isActive ? <EyeOff /> : <Eye />}
                {isActive ? "Deactivate listing" : "Activate listing"}
              </button>
              <Link
                to={`/host/listing/update/${listing._id}`}
                className="w-full flex items-center gap-2 justify-center py-2.5 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer no-underline transition-colors"
              >
                <Edit2 size={14} /> Edit listing
              </Link>
              <button
                onClick={handleSoftDelete}
                className="w-full flex items-center gap-2 justify-center py-2.5 rounded-xl text-sm font-semibold border border-red-100 text-red-500 hover:bg-red-50 bg-white cursor-pointer transition-colors"
              >
                <Trash2 size={14} /> Delete listing
              </button>
            </div>
          </div>
        )}

        {tab === "amenities" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-4">
              Amenities{" "}
              <span className="text-gray-400 font-normal">
                ({listing.amenities.length})
              </span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {listing.amenities.map((a) => {
                const cfg = AMENITY_MAP[a];
                if (!cfg) return null;
                return (
                  <div
                    key={a}
                    className="flex items-center gap-2.5 bg-blue-50 border border-blue-100 px-4 py-3 rounded-xl"
                  >
                    <cfg.Icon size={15} className="text-blue-600 shrink-0" />
                    <span className="text-[13px] font-semibold text-blue-700">
                      {cfg.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === "bookings" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">
                Recent Bookings
              </h3>
            </div>
            {!listing.recentBookings?.length && (
              <p className="px-5 py-4 text-gray-400 text-sm">
                No bookings yet.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
