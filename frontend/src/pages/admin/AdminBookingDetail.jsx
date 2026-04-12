import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  MapPin,
  Users,
  BedDouble,
  Bath,
  Bed,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  Mail,
  Phone,
  Home,
  ChevronDown,
} from "lucide-react";

// ── helpers ───────────────────────────────────────────────────────────────────
const fmt = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
const nights = (ci, co) => Math.round((new Date(co) - new Date(ci)) / 86400000);
const initials = (name) =>
  name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";

const STATUS = {
  confirmed: {
    label: "Confirmed",
    cls: "text-green-600 bg-green-50",
    Icon: CheckCircle,
  },
  pending: {
    label: "Pending",
    cls: "text-yellow-600 bg-yellow-50",
    Icon: Clock,
  },
  cancelled: {
    label: "Cancelled",
    cls: "text-red-500 bg-red-50",
    Icon: XCircle,
  },
};

const AMENITY_LABELS = {
  wifi: "Wi-Fi",
  parking: "Parking",
  pool: "Pool",
  ac: "AC",
  kitchen: "Kitchen",
  tv: "TV",
  heater: "Heater",
  security: "Security",
};

export default function AdminBookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  useEffect(() => {
    axios
      .get(`/bookings/${id}`)
      .then((r) => setBooking(r.data.data))
      .catch(() => navigate(-1))
      .finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async (status) => {
    setDropdown(false);
    setUpdating(true);
    try {
      await axios.patch(`/admin/booking/${id}/status`, { status });
      setBooking((p) => ({ ...p, status }));
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );

  if (!booking) return null;

  const S = STATUS[booking.status] || STATUS.pending;
  const n = nights(booking.checkIn, booking.checkOut);
  const property = booking.property;
  const guest = booking.guest;
  const shortId = booking._id.slice(-8).toUpperCase();

  return (
    <div className="space-y-5 p-6">
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 border-none cursor-pointer transition-colors bg-white border border-gray-200"
          >
            <ArrowLeft size={15} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Booking #{shortId}
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Created {fmt(booking.createdAt)}
            </p>
          </div>
        </div>

        {/* Status toggle */}
        <div className="relative">
          <button
            onClick={() => setDropdown((d) => !d)}
            disabled={updating}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border-none cursor-pointer transition-all ${S.cls}`}
          >
            {updating ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <S.Icon size={14} />
            )}
            {S.label}
            <ChevronDown size={13} />
          </button>

          {dropdown && (
            <div className="absolute right-0 top-[calc(100%+6px)] bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden z-20 w-40">
              {Object.entries(STATUS).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => updateStatus(key)}
                  className={`flex items-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-left border-none cursor-pointer transition-colors
                    ${booking.status === key ? "bg-gray-50 font-semibold" : "bg-white hover:bg-gray-50"}`}
                >
                  <val.Icon size={13} className={val.cls.split(" ")[0]} />
                  {val.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* ── LEFT: Property + Booking info ── */}
        <div className="lg:col-span-2 space-y-5">
          {/* Property card */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {property.images?.[0]?.url && (
              <img
                src={property.images[0].url}
                alt={property.title}
                className="w-full h-44 object-cover"
              />
            )}
            <div className="p-5">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h2 className="text-base font-bold text-gray-900">
                  {property.title}
                </h2>
                <span className="text-[11px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full capitalize shrink-0">
                  {property.propertyType}
                </span>
              </div>
              <p className="text-sm text-gray-400 flex items-center gap-1 mb-4">
                <MapPin size={12} className="text-blue-400 shrink-0" />
                {property.location?.address}
              </p>

              {/* Specs */}
              <div className="grid grid-cols-4 gap-2 py-4 border-y border-gray-50">
                {[
                  { Icon: Users, v: property.maxGuests, l: "Guests" },
                  { Icon: BedDouble, v: property.bedrooms, l: "Bedrooms" },
                  { Icon: Bed, v: property.beds, l: "Beds" },
                  { Icon: Bath, v: property.bathrooms, l: "Baths" },
                ].map(({ Icon, v, l }) => (
                  <div key={l} className="flex flex-col items-center gap-1">
                    <Icon size={14} className="text-blue-600" />
                    <span className="text-sm font-bold text-gray-900">{v}</span>
                    <span className="text-[10px] text-gray-400">{l}</span>
                  </div>
                ))}
              </div>

              {/* Amenities */}
              {property.amenities?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {property.amenities.map((a) => (
                    <span
                      key={a}
                      className="text-[11px] font-medium bg-gray-50 text-gray-500 px-2.5 py-1 rounded-full border border-gray-100"
                    >
                      {AMENITY_LABELS[a] || a}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Booking dates */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-4">
              Booking Details
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              {[
                { label: "Check-in", value: fmt(booking.checkIn) },
                { label: "Check-out", value: fmt(booking.checkOut) },
                { label: "Duration", value: `${n} night${n !== 1 ? "s" : ""}` },
                {
                  label: "Guests",
                  value: `${booking.guestsCount} guest${booking.guestsCount !== 1 ? "s" : ""}`,
                },
              ].map(({ label, value }) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">
                    {label}
                  </p>
                  <p className="text-sm font-semibold text-gray-900">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Guest + Price ── */}
        <div className="space-y-5">
          {/* Guest card */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Guest</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 text-sm font-bold flex items-center justify-center shrink-0">
                {initials(guest?.name)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">
                  {guest?.name}
                </p>
                <p className="text-xs text-gray-400 capitalize">
                  {guest?.role}
                </p>
              </div>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Mail size={12} className="text-blue-400 shrink-0" />
                <span className="truncate">{guest?.email}</span>
              </div>
              {guest?.phone && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Phone size={12} className="text-blue-400 shrink-0" />
                  {guest.phone}
                </div>
              )}
              <div className="flex items-center gap-2 text-xs">
                <span
                  className={`px-2 py-0.5 rounded-full font-semibold ${guest?.isActive ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}
                >
                  {guest?.isActive ? "Active" : "Inactive"}
                </span>
                {guest?.is_verified && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-semibold">
                    Verified
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Price breakdown */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-4">
              Price Breakdown
            </h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>
                  ₹{property.pricePerNight?.toLocaleString()} × {n} nights
                </span>
                <span>₹{(property.pricePerNight * n).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Platform fee (10%)</span>
                <span>
                  ₹{Math.round(booking.totalPrice * 0.1).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100">
                <span>Total</span>
                <span>₹{booking.totalPrice?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Property host ID */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Host</h3>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Home size={12} className="text-blue-400 shrink-0" />
              <span className="font-mono truncate">{booking.host}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
