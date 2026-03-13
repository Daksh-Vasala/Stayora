import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  Users,
  Bed,
  Bath,
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
  const [property, setProperty] = useState();
  const [selectedImage, setSelectedImage] = useState(0);
  const [bookingDates, setBookingDates] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
  });

  useEffect(() => {
    const getProperty = async () => {
      try {
        const res = await axios.get(`/property/${id}`);
        console.log(res.data);
        setProperty(res.data.data);
      } catch (error) {
        console.log(error);
      }
  
    }
    getProperty();
  }, [])

  // Mock property data (replace with API call)
  // const property = {
  //   _id: id,
  //   title: "Luxury Beachfront Villa",
  //   description:
  //     "Experience the ultimate luxury in this stunning beachfront villa. With panoramic ocean views, private pool, and direct beach access.",
  //   propertyType: "villa",
  //   pricePerNight: 250,
  //   location: {
  //     city: "Miami",
  //     country: "USA",
  //     address: "123 Ocean Drive",
  //   },
  //   maxGuests: 6,
  //   bedrooms: 3,
  //   bathrooms: 2,
  //   beds: 4,
  //   amenities: ["Private Pool", "WiFi", "Parking", "Kitchen", "AC", "Beach Access"],
  //   images: [
  //     "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
  //     "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800",
  //     "https://images.unsplash.com/photo-1613545325278-f24b0cae1224?w=800",
  //   ],
  //   host: {
  //     name: "Sarah Johnson",
  //     avatar: "https://i.pravatar.cc/150?u=123",
  //     isSuperhost: true,
  //   },
  //   rating: 4.8,
  //   reviewCount: 124,
  //   houseRules: ["No smoking", "No pets", "Check-in: 3:00 PM - 10:00 PM"],
  // };

  const calculateTotalPrice = () => {
    if (!bookingDates.checkIn || !bookingDates.checkOut) return 0;
    const checkIn = new Date(bookingDates.checkIn);
    const checkOut = new Date(bookingDates.checkOut);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    return nights * property?.pricePerNight;
  };

  const totalPrice = calculateTotalPrice();


  return (
    <div className="min-h-screen bg-slate-50">
      {/* Back Button */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <Link to="/user" className="flex items-center gap-2 text-slate-600 hover:text-blue-600">
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">{property?.title}</h1>
              <div className="flex items-center gap-2 text-slate-500 mb-4">
                <MapPin className="w-4 h-4" />
                <span>{property?.location?.city}, {property?.location?.country}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full">
                  {property?.propertyType?.toUpperCase()}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-slate-900">{property?.rating}</span>
                  <span className="text-slate-500 text-sm">({property?.reviewCount} reviews)</span>
                </div>
              </div>
            </div>

            {/* Image Gallery */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <img
                src={property?.images[selectedImage]}
                alt={property?.title}
                className="w-full h-80 object-cover rounded-xl"
              />
              <div className="flex gap-2 mt-4 overflow-x-auto">
                {property?.images?.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? "border-blue-600" : "border-slate-200"
                    }`}
                  >
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-3">About</h2>
              <p className="text-slate-600">{property?.description}</p>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { icon: Wifi, name: "WiFi" },
                  { icon: Car, name: "Parking" },
                  { icon: Coffee, name: "Kitchen" },
                  { icon: Home, name: "AC" },
                  { icon: Calendar, name: "Pool" },
                  { icon: CheckCircle, name: "Washer" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                    <item.icon className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-slate-700">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* House Rules */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">House Rules</h2>
              <div className="space-y-2">
                {property?.houseRules?.map((rule, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-slate-600 text-sm">{rule}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 sticky top-24">
              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-bold text-slate-900">₹{property?.pricePerNight}</span>
                  <span className="text-slate-500">/ night</span>
                </div>
                <p className="text-sm text-slate-500">
                  Total: <span className="font-semibold text-slate-900">₹{totalPrice || 0}</span>
                </p>
              </div>

              {/* Booking Form */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Check-in</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="date"
                      value={bookingDates?.checkIn}
                      onChange={(e) => setBookingDates({ ...bookingDates, checkIn: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Check-out</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="date"
                      value={bookingDates.checkOut}
                      onChange={(e) => setBookingDates({ ...bookingDates, checkOut: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Guests</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <select
                      value={bookingDates.guests}
                      onChange={(e) => setBookingDates({ ...bookingDates, guests: parseInt(e.target.value) })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm"
                    >
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? "guest" : "guests"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Book Button */}
              <button
                disabled={!bookingDates.checkIn || !bookingDates.checkOut}
                className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reserve Now
              </button>

              {/* Trust Badges */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  <span>Secure payment • Free cancellation</span>
                </div>
              </div>

              {/* Host Info */}
              <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <img src={property?.host?.avatar} alt={property?.host?.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{property?.host?.name}</p>
                    {property?.host?.isSuperhost && (
                      <span className="text-xs text-blue-600 font-medium">Superhost</span>
                    )}
                  </div>
                </div>
                <button className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                  <MessageCircle className="w-4 h-4" />
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