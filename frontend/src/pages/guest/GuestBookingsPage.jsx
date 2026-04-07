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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Unable to load bookings</h2>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchBookings}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          My Bookings
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          {bookings.length} total bookings
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
        <StatCard label="Total" count={stats.total} color="gray" />
        <StatCard label="Confirmed" count={stats.confirmed} color="green" />
        <StatCard label="Pending" count={stats.pending} color="yellow" />
        <StatCard label="Completed" count={stats.completed} color="blue" />
        <StatCard label="Cancelled" count={stats.cancelled} color="red" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none] pb-1 mb-6">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`shrink-0 px-4 py-2 rounded-xl text-[12.5px] font-semibold capitalize transition-all border-none cursor-pointer
              ${tab === t ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
          >
            {t} ({stats[t === "all" ? "total" : t]})
          </button>
        ))}
      </div>

      {/* Booking cards */}
      {filteredBookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center">
            <BookOpen size={22} className="text-gray-300" />
          </div>
          <p className="text-sm font-semibold text-gray-500">
            No {tab !== "all" ? tab : ""} bookings found
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            const property = properties[booking.property];
            const nights = calculateNights(booking.checkIn, booking.checkOut);
            const S = STATUS[booking.status] || STATUS.pending;
            
            if (!property) {
              return (
                <div key={booking._id} className="bg-white rounded-2xl border border-gray-100 p-4">
                  <p className="text-sm text-gray-500">Property details unavailable</p>
                </div>
              );
            }

            return (
              <div
                key={booking._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Image */}
                  <div className="relative sm:w-44 h-40 sm:h-auto bg-gray-100 shrink-0">
                    <img
                      src={property.images?.[0]?.url || "https://placehold.co/400x300?text=No+Image"}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                    <span
                      className={`absolute top-3 left-3 text-white text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${TYPE_COLOR[property.propertyType] || "bg-blue-500"}`}
                    >
                      {property.propertyType}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">
                          {booking._id.slice(-8)}
                        </p>
                        <h3 className="text-[15px] font-bold text-gray-900 truncate">
                          {property.title}
                        </h3>
                        <p className="text-[12px] text-gray-400 flex items-center gap-1 mt-1">
                          <MapPin size={10} className="shrink-0" /> 
                          {property.location?.city}, {property.location?.country}
                        </p>
                      </div>
                      {/* Status badge */}
                      <span
                        className={`shrink-0 flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${S.cls}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${S.dot}`} />
                        {S.label}
                      </span>
                    </div>

                    {/* Meta row */}
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
                      <div className="flex items-center gap-1.5 text-[12px] text-gray-500">
                        <Calendar size={12} className="text-blue-500" />
                        {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                      </div>
                      <div className="flex items-center gap-1.5 text-[12px] text-gray-500">
                        <Tag size={12} className="text-blue-500" />
                        {nights} night{nights > 1 ? "s" : ""}
                      </div>
                      <div className="flex items-center gap-1.5 text-[12px] text-gray-500">
                        <Users size={12} className="text-blue-500" />
                        {booking.guestsCount} guest{booking.guestsCount > 1 ? "s" : ""}
                      </div>
                    </div>

                    {/* Payment Status */}
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                        booking.paymentStatus === "paid" 
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {booking.paymentStatus === "paid" ? "Paid" : "Payment Pending"}
                      </span>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-50">
                      <div>
                        <span className="text-[11px] text-gray-400">
                          Total {booking.paymentStatus === "paid" ? "paid" : "amount"}
                        </span>
                        <span className="text-[15px] font-bold text-gray-900 ml-1">
                          ₹{booking.totalPrice.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {booking.status === "confirmed" && (
                          <button
                            onClick={() => handleCancelBooking(booking._id)}
                            className="flex items-center gap-1.5 text-[12px] font-semibold text-red-500 hover:text-red-600 border border-red-100 hover:bg-red-50 px-3 py-1.5 rounded-xl cursor-pointer bg-transparent transition-colors"
                          >
                            <XCircle size={12} /> Cancel
                          </button>
                        )}
                        <button
                          onClick={() => handleViewBooking(booking._id)}
                          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-bold px-4 py-1.5 rounded-xl border-none cursor-pointer transition-colors"
                        >
                          <Eye size={12} /> View
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

// Stat Card Component
const StatCard = ({ label, count, color }) => {
  const colors = {
    gray: "bg-gray-50 text-gray-600",
    green: "bg-green-50 text-green-600",
    yellow: "bg-yellow-50 text-yellow-600",
    blue: "bg-blue-50 text-blue-600",
    red: "bg-red-50 text-red-600",
  };
  
  return (
    <div className={`p-2 rounded-lg text-center ${colors[color]}`}>
      <div className="text-lg font-bold">{count}</div>
      <div className="text-[10px] font-medium">{label}</div>
    </div>
  );
};