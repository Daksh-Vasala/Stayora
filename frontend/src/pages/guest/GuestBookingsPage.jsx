// GuestBookingsPage.jsx
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  MapPin,
  Star,
  BookOpen,
  XCircle,
  Calendar,
  Tag,
  Eye,
  AlertCircle,
  Home,
  Users,
} from "lucide-react";

const TYPE_COLOR = {
  villa: "bg-blue-600",
  apartment: "bg-blue-500",
  house: "bg-blue-700",
  studio: "bg-blue-400",
};

const STATUS = {
  confirmed: {
    label: "Confirmed",
    cls: "bg-green-50 text-green-700",
    dot: "bg-green-500",
  },
  pending: {
    label: "Pending",
    cls: "bg-amber-50 text-amber-700",
    dot: "bg-amber-400",
  },
  completed: {
    label: "Completed",
    cls: "bg-gray-100 text-gray-600",
    dot: "bg-gray-400",
  },
  cancelled: {
    label: "Cancelled",
    cls: "bg-red-50 text-red-600",
    dot: "bg-red-400",
  },
};

export default function GuestBookingsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [properties, setProperties] = useState({});
  const [tab, setTab] = useState("all");
  const [error, setError] = useState(null);

  const tabs = ["all", "confirmed", "pending", "completed", "cancelled"];

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/bookings/getBookings");
      const bookingsData = response.data.data;
      setBookings(bookingsData);
      
      // Fetch property details for each booking
      const propertyIds = [...new Set(bookingsData.map(b => b.property))];
      const propertyPromises = propertyIds.map(id => 
        axios.get(`/property/${id}`).catch(err => {
          console.error(`Failed to fetch property ${id}:`, err);
          return null;
        })
      );
      
      const propertyResponses = await Promise.all(propertyPromises);
      const propertiesMap = {};
      propertyResponses.forEach((res, index) => {
        if (res && res.data && res.data.data) {
          propertiesMap[propertyIds[index]] = res.data.data;
        }
      });
      
      setProperties(propertiesMap);
      setError(null);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError(err.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    
    try {
      await axios.patch(`/bookings/${bookingId}/cancel`);
      fetchBookings(); // Refresh bookings
    } catch (err) {
      console.error("Cancel failed:", err);
      alert(err.response?.data?.message || "Failed to cancel booking");
    }
  };

  const handleViewBooking = (bookingId) => {
    navigate(`/bookings/${bookingId}`);
  };

  const filteredBookings = useMemo(() => {
    if (tab === "all") return bookings;
    return bookings.filter((b) => b.status === tab);
  }, [bookings, tab]);

  const stats = useMemo(() => {
    return {
      total: bookings.length,
      confirmed: bookings.filter(b => b.status === "confirmed").length,
      pending: bookings.filter(b => b.status === "pending").length,
      completed: bookings.filter(b => b.status === "completed").length,
      cancelled: bookings.filter(b => b.status === "cancelled").length,
    };
  }, [bookings]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 border-b-2 md:border-b-3 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl md:rounded-2xl p-6 md:p-8 text-center max-w-md md:max-w-lg">
          <AlertCircle size={48} className="md:text-5xl text-red-500 mx-auto mb-3 md:mb-4" />
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">Unable to load bookings</h2>
          <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">{error}</p>
          <button
            onClick={fetchBookings}
            className="px-4 md:px-6 py-2 md:py-2.5 bg-red-600 text-white rounded-lg md:rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
          My Bookings
        </h1>
        <p className="text-sm md:text-base text-gray-500 mt-1 md:mt-2">
          Manage and track all your property reservations
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 md:gap-4 mb-6 md:mb-8">
        <StatCard label="Total" count={stats.total} color="gray" />
        <StatCard label="Confirmed" count={stats.confirmed} color="green" />
        <StatCard label="Pending" count={stats.pending} color="yellow" />
        <StatCard label="Completed" count={stats.completed} color="blue" />
        <StatCard label="Cancelled" count={stats.cancelled} color="red" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 md:gap-2 overflow-x-auto [scrollbar-width:none] pb-2 mb-6 md:mb-8">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`shrink-0 px-3 md:px-5 py-1.5 md:py-2.5 rounded-lg md:rounded-xl text-xs md:text-sm font-semibold capitalize transition-all border-none cursor-pointer whitespace-nowrap
              ${tab === t ? "bg-blue-600 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            {t} ({stats[t === "all" ? "total" : t]})
          </button>
        ))}
      </div>

      {/* Booking cards */}
      {filteredBookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 md:py-24 gap-3 md:gap-4">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gray-50 flex items-center justify-center">
            <BookOpen size={28} className="md:text-3xl text-gray-300" />
          </div>
          <p className="text-sm md:text-base font-semibold text-gray-500">
            No {tab !== "all" ? tab : ""} bookings found
          </p>
          <p className="text-xs md:text-sm text-gray-400">Book a property to get started</p>
        </div>
      ) : (
        <div className="space-y-4 md:space-y-6">
          {filteredBookings.map((booking) => {
            const property = properties[booking.property];
            const nights = calculateNights(booking.checkIn, booking.checkOut);
            const S = STATUS[booking.status] || STATUS.pending;
            
            if (!property) {
              return (
                <div key={booking._id} className="bg-white rounded-xl md:rounded-2xl border border-gray-200 p-4 md:p-6">
                  <p className="text-sm md:text-base text-gray-500">Property details unavailable</p>
                </div>
              );
            }

            return (
              <div
                key={booking._id}
                className="bg-white rounded-xl md:rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-200"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="relative w-full md:w-64 h-48 md:h-auto bg-gray-100 shrink-0">
                    <img
                      src={property.images?.[0]?.url || "https://placehold.co/600x400?text=No+Image"}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                    <span
                      className={`absolute top-3 left-3 md:top-4 md:left-4 text-[10px] md:text-xs font-bold px-2 py-0.5 md:px-3 md:py-1 rounded-full capitalize shadow-md ${TYPE_COLOR[property.propertyType] || "bg-blue-500"}`}
                    >
                      {property.propertyType}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="flex-1 p-4 md:p-6 flex flex-col justify-between gap-3 md:gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                          Booking #{booking._id.slice(-8)}
                        </p>
                        <h3 className="text-base md:text-xl font-bold text-gray-900 truncate mb-1">
                          {property.title}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-500 flex items-center gap-1 md:gap-1.5 mt-1">
                          <MapPin size={12} className="md:w-3.5 md:h-3.5 shrink-0" /> 
                          {property.location?.city}, {property.location?.country}
                        </p>
                      </div>
                      {/* Status badge */}
                      <span
                        className={`self-start sm:self-center shrink-0 flex items-center gap-1.5 md:gap-2 text-[11px] md:text-sm font-semibold px-2 md:px-3 py-1 md:py-1.5 rounded-full ${S.cls}`}
                      >
                        <span className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${S.dot}`} />
                        {S.label}
                      </span>
                    </div>

                    {/* Meta row - responsive grid for mobile */}
                    <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-2 sm:gap-x-6 md:gap-x-8 sm:gap-y-2">
                      <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-gray-600">
                        <Calendar size={14} className="md:w-4 md:h-4 text-blue-500" />
                        <span className="truncate">{formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-gray-600">
                        <Tag size={14} className="md:w-4 md:h-4 text-blue-500" />
                        <span>{nights} night{nights > 1 ? "s" : ""}</span>
                      </div>
                      <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-gray-600">
                        <Users size={14} className="md:w-4 md:h-4 text-blue-500" />
                        <span>{booking.guestsCount} guest{booking.guestsCount > 1 ? "s" : ""}</span>
                      </div>
                    </div>

                    {/* Payment Status */}
                    <div className="flex items-center gap-2 md:gap-3">
                      <span className={`text-[10px] md:text-xs px-2 md:px-3 py-0.5 md:py-1 rounded-full font-medium ${
                        booking.paymentStatus === "paid" 
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {booking.paymentStatus === "paid" ? "✓ Paid" : "⏳ Payment Pending"}
                      </span>
                    </div>

                    {/* Footer - responsive buttons for mobile */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 md:pt-4 border-t border-gray-100">
                      <div className="flex items-baseline">
                        <span className="text-[11px] md:text-sm text-gray-500">
                          Total {booking.paymentStatus === "paid" ? "paid" : "amount"}
                        </span>
                        <span className="text-lg md:text-2xl font-bold text-gray-900 ml-1.5 md:ml-2">
                          ₹{booking.totalPrice.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 md:gap-3">
                        {booking.status === "confirmed" && (
                          <button
                            onClick={() => handleCancelBooking(booking._id)}
                            className="flex items-center justify-center gap-1.5 md:gap-2 text-[11px] md:text-sm font-semibold text-red-600 hover:text-red-700 border border-red-200 hover:bg-red-50 px-2.5 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl cursor-pointer bg-transparent transition-all flex-1 sm:flex-initial"
                          >
                            <XCircle size={14} className="md:w-4 md:h-4" /> 
                            <span>Cancel</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleViewBooking(booking._id)}
                          className="flex items-center justify-center gap-1.5 md:gap-2 bg-blue-600 hover:bg-blue-700 text-white text-[11px] md:text-sm font-semibold px-3 md:px-5 py-1.5 md:py-2 rounded-lg md:rounded-xl border-none cursor-pointer transition-all shadow-sm hover:shadow-md flex-1 sm:flex-initial"
                        >
                          <Eye size={14} className="md:w-4 md:h-4" /> 
                          <span>View</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Stat Card Component - responsive version
const StatCard = ({ label, count, color }) => {
  const colors = {
    gray: "bg-gray-50 text-gray-600",
    green: "bg-green-50 text-green-600",
    yellow: "bg-yellow-50 text-yellow-600",
    blue: "bg-blue-50 text-blue-600",
    red: "bg-red-50 text-red-600",
  };
  
  return (
    <div className={`p-2 md:p-4 rounded-lg md:rounded-xl text-center transition-all hover:scale-105 ${colors[color]}`}>
      <div className="text-lg md:text-2xl font-bold">{count}</div>
      <div className="text-[10px] md:text-sm font-medium mt-0.5 md:mt-1">{label}</div>
    </div>
  );
};