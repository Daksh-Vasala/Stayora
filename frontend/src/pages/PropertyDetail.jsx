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
  Coffee,
  Home,
} from "lucide-react";
import axios from "axios";

function PropertyDetail() {
  const { id } = useParams();

  const [property, setProperty] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [bookingDates, setBookingDates] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
  });

  /* ---------------- FETCH PROPERTY ---------------- */

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { data } = await axios.get(`/property/${id}`);
        setProperty(data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProperty();
  }, [id]);

  /* ---------------- BOOKING HANDLERS ---------------- */

  const updateBooking = (key, value) => {
    setBookingDates((prev) => ({ ...prev, [key]: value }));
  };

  /* ---------------- PRICE CALCULATION ---------------- */

  const calculateTotalPrice = () => {
    const { checkIn, checkOut } = bookingDates;

    if (!checkIn || !checkOut || !property) return 0;

    const nights =
      (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);

    return Math.max(nights, 0) * property.pricePerNight;
  };

  const totalPrice = calculateTotalPrice();

  if (!property) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Back Button */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-slate-600 hover:text-blue-600"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back</span>
          </Link>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">
                {property.title}
              </h1>

              <div className="flex items-center gap-2 text-slate-500 mb-4">
                <MapPin size={16} />
                {property.location?.city}, {property.location?.country}
              </div>

              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full">
                  {property.propertyType?.toUpperCase()}
                </span>

                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{property.rating}</span>
                  <span className="text-slate-500 text-sm">
                    ({property.reviewCount})
                  </span>
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <img
                src={property.images?.[selectedImage]}
                alt={property.title}
                className="w-full h-80 object-cover rounded-xl"
              />

              <div className="flex gap-2 mt-4 overflow-x-auto">
                {property.images?.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === i
                        ? "border-blue-600"
                        : "border-slate-200"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold mb-3">About</h2>
              <p className="text-slate-600">{property.description}</p>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold mb-4">Amenities</h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { icon: Wifi, name: "WiFi" },
                  { icon: Car, name: "Parking" },
                  { icon: Coffee, name: "Kitchen" },
                  { icon: Home, name: "AC" },
                  { icon: Calendar, name: "Pool" },
                  { icon: CheckCircle, name: "Washer" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"
                  >
                    <item.icon size={18} className="text-blue-600" />
                    <span className="text-sm">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* House Rules */}
            {property.houseRules?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-lg font-bold mb-4">House Rules</h2>

                <div className="space-y-2">
                  {property.houseRules.map((rule, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-green-500" />
                      <span className="text-sm text-slate-600">{rule}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT BOOKING CARD */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 sticky top-24">
              <div className="mb-6">
                <span className="text-3xl font-bold">
                  ₹{property.pricePerNight}
                </span>
                <span className="text-slate-500"> / night</span>

                <p className="text-sm text-slate-500 mt-1">
                  Total:{" "}
                  <span className="font-semibold text-slate-900">
                    ₹{totalPrice}
                  </span>
                </p>
              </div>

              {/* Booking Form */}
              <div className="space-y-4 mb-6">
                <input
                  type="date"
                  value={bookingDates.checkIn}
                  onChange={(e) => updateBooking("checkIn", e.target.value)}
                  className="input"
                />

                <input
                  type="date"
                  value={bookingDates.checkOut}
                  onChange={(e) => updateBooking("checkOut", e.target.value)}
                  className="input"
                />

                <select
                  value={bookingDates.guests}
                  onChange={(e) =>
                    updateBooking("guests", parseInt(e.target.value))
                  }
                  className="input"
                >
                  {[1, 2, 3, 4, 5, 6].map((g) => (
                    <option key={g}>{g}</option>
                  ))}
                </select>
              </div>

              <button
                disabled={!bookingDates.checkIn || !bookingDates.checkOut}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                Reserve Now
              </button>

              <div className="mt-4 pt-4 border-t text-sm text-slate-500 flex items-center gap-2">
                <ShieldCheck size={16} className="text-green-500" />
                Secure payment • Free cancellation
              </div>

              {/* Host */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center gap-3">
                  <img
                    src={property.host?.avatar}
                    alt=""
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold">
                      {property.host?.name}
                    </p>
                    {property.host?.isSuperhost && (
                      <span className="text-xs text-blue-600">Superhost</span>
                    )}
                  </div>
                </div>

                <button className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 border rounded-xl text-sm hover:bg-slate-50">
                  <MessageCircle size={16} />
                  Message Host
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyDetail;