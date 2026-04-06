import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  Users,
  Star,
  Calendar,
  CheckCircle,
  MessageCircle,
  ArrowLeft,
  ShieldCheck,
  Wifi,
  Car,
  Waves,
  Wind,
  Tv,
  UtensilsCrossed,
  Shield,
  Flame,
  BedDouble,
  Bath,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Matches amenities[] strings from your schema
const AMENITY_MAP = {
  wifi: { label: "Wi-Fi", Icon: Wifi },
  parking: { label: "Parking", Icon: Car },
  pool: { label: "Pool", Icon: Waves },
  ac: { label: "AC", Icon: Wind },
  kitchen: { label: "Kitchen", Icon: UtensilsCrossed },
  tv: { label: "TV", Icon: Tv },
  heater: { label: "Heater", Icon: Flame },
  security: { label: "Security", Icon: Shield },
};

const inp =
  "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 transition-all bg-white";

function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [imgIdx, setImgIdx] = useState(0);
  const [booking, setBooking] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
  });

  useEffect(() => {
    axios
      .get(`/property/${id}`)
      .then(({ data }) => setProperty(data.data))
      .catch(console.error);
  }, [id]);

  const updateBooking = (k, v) => setBooking((p) => ({ ...p, [k]: v }));

  const nights =
    booking.checkIn && booking.checkOut
      ? Math.max(
          (new Date(booking.checkOut) - new Date(booking.checkIn)) / 86400000,
          0,
        )
      : 0;

  const total = nights * (property?.pricePerNight || 0);

  // ── images is [{url, public_id}] per schema ──────────────────────────────
  const images = property?.images || [];
  const currImg = images[imgIdx]?.url || "";

  const prev = () => setImgIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setImgIdx((i) => (i + 1) % images.length);
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!property)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  const reserveBooking = async () => {
    try {
      if (!user) {
        toast.error("Please login to make a booking");
        return navigate("/login");
      }
      const guestsCount = booking.guests;
      const checkIn = booking.checkIn;
      const checkOut = booking.checkOut;
      const res = await axios.post("/bookings", {
        checkIn,
        checkOut,
        guestsCount,
        propertyId: id,
      });
      console.log(res);
      toast.success(res.data.message);
      navigate(`/bookings/${res.data.data._id}`);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Internal server error");
    }
  };

  const handleMessageHost = async () => {
    try {
      if (!user) {
        toast.error("Login first");
        return navigate("/login");
      }

      if (property.host._id === user.id) {
        return toast.info("This is your property");
      }

      const res = await axios.post("/chats", {
        receiverId: property.host._id,
        property: property._id,
      });

      const chat = res.data;

      navigate("/messages", {
        state: { chatId: chat._id },
      });
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* ── LEFT ── */}
          <div className="lg:col-span-2 space-y-4">
            {/* Title */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <span className="text-[11px] font-bold text-white bg-blue-600 px-2.5 py-1 rounded-full capitalize mb-2 inline-block">
                    {property.propertyType}
                  </span>
                  <h1 className="text-xl font-bold text-gray-900">
                    {property.title}
                  </h1>
                  <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                    <MapPin size={13} className="text-blue-500 shrink-0" />
                    {property.location?.address &&
                      `${property.location.address}, `}
                    {property.location?.city}, {property.location?.country}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Star size={14} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-bold text-gray-900">
                    {property.rating}
                  </span>
                  <span className="text-xs text-gray-400">
                    ({property.reviewCount} reviews)
                  </span>
                </div>
              </div>

              {/* Specs row */}
              <div className="flex items-center gap-5 mt-4 pt-4 border-t border-gray-50 text-sm text-gray-600">
                {[
                  { Icon: Users, v: `${property.maxGuests} guests` },
                  { Icon: BedDouble, v: `${property.bedrooms} bedrooms` },
                  { Icon: BedDouble, v: `${property.beds} beds` },
                  { Icon: Bath, v: `${property.bathrooms} baths` },
                ].map(({ Icon, v }, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1.5 text-xs font-medium"
                  >
                    <Icon size={13} className="text-blue-600" />
                    {v}
                  </span>
                ))}
              </div>
            </div>

            {/* Images — uses images[].url from schema */}
            {images.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                {/* Main image */}
                <div className="relative h-64 sm:h-80 rounded-xl overflow-hidden bg-gray-100">
                  <img
                    src={currImg}
                    alt={property.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prev}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center border-none cursor-pointer hover:bg-white transition-colors"
                      >
                        <ChevronLeft size={15} className="text-gray-700" />
                      </button>
                      <button
                        onClick={next}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center border-none cursor-pointer hover:bg-white transition-colors"
                      >
                        <ChevronRight size={15} className="text-gray-700" />
                      </button>
                      <span className="absolute bottom-3 right-3 text-[11px] font-semibold bg-black/50 text-white px-2 py-0.5 rounded-full">
                        {imgIdx + 1} / {images.length}
                      </span>
                    </>
                  )}
                </div>
                {/* Thumbnails — images[i].url */}
                {images.length > 1 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto [scrollbar-width:none]">
                    {images.map((img, i) => (
                      <button
                        key={img.public_id || i}
                        onClick={() => setImgIdx(i)}
                        className={`shrink-0 w-16 h-12 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${i === imgIdx ? "border-blue-600" : "border-transparent opacity-60 hover:opacity-100"}`}
                      >
                        <img
                          src={img.url}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="text-sm font-bold text-gray-900 mb-2">
                About this place
              </h2>
              <p className="text-[13.5px] text-gray-600 leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Amenities — maps amenities[] strings to icons */}
            {property.amenities?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h2 className="text-sm font-bold text-gray-900 mb-3">
                  Amenities
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {property.amenities.map((a) => {
                    const cfg = AMENITY_MAP[a];
                    if (!cfg) return null;
                    const { label, Icon } = cfg;
                    return (
                      <div
                        key={a}
                        className="flex items-center gap-2.5 bg-blue-50 px-3 py-2.5 rounded-xl"
                      >
                        <Icon size={14} className="text-blue-600 shrink-0" />
                        <span className="text-[13px] font-medium text-blue-700">
                          {label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT — Booking card ── */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-5 sticky top-20">
              {/* Price */}
              <div className="mb-5">
                <span className="text-2xl font-bold text-gray-900">
                  ₹{property.pricePerNight?.toLocaleString()}
                </span>
                <span className="text-sm text-gray-400"> / night</span>
                {nights > 0 && (
                  <p className="text-xs text-gray-400 mt-1">
                    {nights} night{nights > 1 ? "s" : ""} ·{" "}
                    <span className="font-bold text-gray-900">
                      ₹{total.toLocaleString()} total
                    </span>
                  </p>
                )}
              </div>

              {/* Form */}
              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">
                    Check-in
                  </label>
                  <input
                    type="date"
                    className={inp}
                    value={booking.checkIn}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => updateBooking("checkIn", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">
                    Check-out
                  </label>
                  <input
                    type="date"
                    className={inp}
                    value={booking.checkOut}
                    min={
                      booking.checkIn || new Date().toISOString().split("T")[0]
                    }
                    onChange={(e) => updateBooking("checkOut", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">
                    Guests
                  </label>
                  <select
                    className={inp}
                    value={booking.guests}
                    onChange={(e) =>
                      updateBooking("guests", parseInt(e.target.value))
                    }
                  >
                    {Array.from(
                      { length: property.maxGuests || 6 },
                      (_, i) => i + 1,
                    ).map((g) => (
                      <option key={g} value={g}>
                        {g} guest{g > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                disabled={!booking.checkIn || !booking.checkOut || nights <= 0}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold text-sm transition-colors border-none cursor-pointer"
                onClick={reserveBooking}
              >
                Reserve Now
              </button>

              <div className="mt-3 flex items-center gap-1.5 text-[11px] text-gray-400">
                <ShieldCheck size={13} className="text-green-500 shrink-0" />
                Secure payment · Free cancellation
              </div>

              {/* Host — uses host ref populated from User */}
              {property.host && (
                <div className="mt-5 pt-5 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    {property.host.avatar ? (
                      <img
                        src={property.host.avatar}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 text-sm font-bold flex items-center justify-center shrink-0">
                        {property.host.name?.[0]?.toUpperCase() || "H"}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {property.host.name || "Host"}
                      </p>
                      <p className="text-[11px] text-gray-400">Verified Host</p>
                    </div>
                  </div>
                  <button
                    onClick={handleMessageHost}
                    className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer bg-white transition-colors"
                  >
                    <MessageCircle size={14} /> Message Host
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyDetail;
