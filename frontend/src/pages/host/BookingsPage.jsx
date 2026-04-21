import { useState, useEffect, useMemo } from "react";
import {
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
  User,
  Home,
  IndianRupee,
  Filter,
  Search,
  ChevronDown,
  Eye,
  MessageCircle,
  AlertCircle,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useMessaging } from "../../hooks/useMessaging";
const STATUS_CONFIG = {
  confirmed: {
    label: "Confirmed",
    cls: "bg-green-50 text-green-700 border-green-200",
    dot: "bg-green-500",
    icon: CheckCircle,
  },
  pending: {
    label: "Pending",
    cls: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
    icon: Clock,
  },
  cancelled: {
    label: "Cancelled",
    cls: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500",
    icon: XCircle,
  },
  completed: {
    label: "Completed",
    cls: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
    icon: CheckCircle,
  },
};

function BookingsPage() {
  const navigate = useNavigate();
  const { messageAboutBooking, isMessagingTarget } = useMessaging();
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const tabs = ["all", "confirmed", "pending", "cancelled", "completed"];

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/bookings");
      setBookings(res.data.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setError(error.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const formatShortDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });

  const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const transformedBookings = useMemo(() => {
    return bookings.map((b) => ({
      id: b._id,
      guest: b.guest?.name || "Unknown Guest",
      guestEmail: b.guest?.email || "",
      guestId: b.guest?._id,
      property: b.property?.title || "Deleted Property",
      propertyId: b.property?._id,
      propertyImage: b.property?.images?.[0]?.url || null,
      propertyType: b.property?.propertyType || "property",
      location: b.property?.location,
      checkIn: b.checkIn,
      checkOut: b.checkOut,
      dates: `${formatShortDate(b.checkIn)} – ${formatShortDate(b.checkOut)}`,
      fullDates: `${formatDate(b.checkIn)} – ${formatDate(b.checkOut)}`,
      nights: calculateNights(b.checkIn, b.checkOut),
      amount: b.totalPrice,
      formattedAmount: `₹${b.totalPrice.toLocaleString()}`,
      status: b.status,
      paymentStatus: b.paymentStatus,
      guestsCount: b.guestsCount,
      createdAt: b.createdAt,
    }));
  }, [bookings]);

  const stats = useMemo(() => {
    return {
      total: bookings.length,
      confirmed: bookings.filter((b) => b.status === "confirmed").length,
      pending: bookings.filter((b) => b.status === "pending").length,
      cancelled: bookings.filter((b) => b.status === "cancelled").length,
      completed: bookings.filter((b) => b.status === "completed").length,
    };
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    let filtered = transformedBookings;

    // Apply status filter
    if (filter !== "all") {
      filtered = filtered.filter((b) => b.status === filter);
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.guest.toLowerCase().includes(term) ||
          b.property.toLowerCase().includes(term) ||
          b.guestEmail.toLowerCase().includes(term),
      );
    }

    return filtered;
  }, [transformedBookings, filter, searchTerm]);

  const handleViewBooking = (bookingId) => {
    navigate(`/bookings/${bookingId}`);
  };

  const handleMessageGuest = (guestId, booking) => {
    if (guestId) {
      messageAboutBooking(guestId, booking);
    }
  };

  const clearFilters = () => {
    setFilter("all");
    setSearchTerm("");
    setShowFilters(false);
  };

  const hasActiveFilters = filter !== "all" || searchTerm;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-500">Loading bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-6">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center max-w-md">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Failed to Load Bookings
          </h3>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchBookings}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Header Section */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                Bookings Management
              </h1>
              <p className="text-sm md:text-base text-gray-500 mt-1">
                Manage and track all customer reservations
              </p>
            </div>

            {/* Stats Summary - Mobile */}
            <div className="grid grid-cols-3 sm:hidden gap-2">
              <StatCardMobile label="Total" count={stats.total} color="blue" />
              <StatCardMobile
                label="Confirmed"
                count={stats.confirmed}
                color="green"
              />
              <StatCardMobile
                label="Pending"
                count={stats.pending}
                color="amber"
              />
            </div>
          </div>
        </div>

        {/* Stats Summary - Desktop */}
        <div className="hidden sm:grid grid-cols-5 gap-4 mb-6">
          <StatCard label="Total Bookings" count={stats.total} color="blue" />
          <StatCard label="Confirmed" count={stats.confirmed} color="green" />
          <StatCard label="Pending" count={stats.pending} color="amber" />
          <StatCard label="Completed" count={stats.completed} color="teal" />
          <StatCard label="Cancelled" count={stats.cancelled} color="red" />
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl md:rounded-2xl border border-gray-200 shadow-sm p-4 md:p-5 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by guest name, property, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
              />
            </div>

            {/* Tabs - Desktop */}
            <div className="hidden sm:flex items-center gap-1.5 bg-gray-100 p-1 rounded-lg">
              {tabs.map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`px-3.5 py-1.5 rounded-md text-xs font-semibold capitalize transition-all border-none cursor-pointer whitespace-nowrap
                    ${
                      filter === t
                        ? "bg-white text-gray-900 shadow-sm"
                        : "bg-transparent text-gray-500 hover:text-gray-700"
                    }`}
                >
                  {t} ({stats[t === "all" ? "total" : t]})
                </button>
              ))}
            </div>

            {/* Filter Toggle - Mobile */}
            <div className="sm:hidden flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 text-sm font-medium flex items-center justify-center gap-2"
              >
                <Filter size={16} />
                Filter
                {hasActiveFilters && (
                  <span className="ml-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                    {
                      Object.values({
                        filter: filter !== "all",
                        search: !!searchTerm,
                      }).filter(Boolean).length
                    }
                  </span>
                )}
              </button>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2.5 rounded-lg border border-red-200 bg-red-50 text-red-600 text-sm font-medium"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Mobile Tabs */}
          <div className="sm:hidden mt-3 overflow-x-auto">
            <div className="flex gap-1.5 pb-2">
              {tabs.map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all whitespace-nowrap
                    ${
                      filter === t
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-gray-100 text-gray-600"
                    }`}
                >
                  {t} ({stats[t === "all" ? "total" : t]})
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-3 pt-2 border-t border-gray-100">
            <p className="text-xs md:text-sm text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-700">
                {filteredBookings.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-700">
                {transformedBookings.length}
              </span>{" "}
              bookings
            </p>
          </div>
        </div>

        {/* Bookings Table/Cards */}
        <div className="bg-white rounded-xl md:rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Desktop Header */}
          <div className="hidden md:grid grid-cols-[1fr_1.5fr_1fr_0.8fr_0.8fr_0.8fr] gap-4 px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Guest
            </span>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Property
            </span>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Stay Period
            </span>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Guests
            </span>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Amount
            </span>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Status
            </span>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                No bookings found
              </h3>
              <p className="text-sm text-gray-500">
                {hasActiveFilters
                  ? "Try adjusting your filters"
                  : "No bookings available yet"}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredBookings.map((booking) => {
                const S = STATUS_CONFIG[booking.status];
                const Icon = S?.icon;

                return (
                  <div
                    key={booking.id}
                    className="group hover:bg-gray-50/50 transition-all duration-200"
                  >
                    {/* Desktop View */}
                    <div className="hidden md:grid grid-cols-[1fr_1.5fr_1fr_0.8fr_0.8fr_0.8fr] gap-4 px-6 py-4 items-center">
                      {/* Guest Info */}
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                          {booking.guest
                            .split(" ")
                            .map((w) => w[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {booking.guest}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {booking.guestEmail}
                          </p>
                        </div>
                      </div>

                      {/* Property Info */}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {booking.property}
                        </p>
                        {booking.location && (
                          <p className="text-xs text-gray-400 truncate">
                            {booking.location.city}, {booking.location.country}
                          </p>
                        )}
                      </div>

                      {/* Dates */}
                      <div>
                        <p className="text-sm text-gray-700">{booking.dates}</p>
                        <p className="text-xs text-gray-400">
                          {booking.nights} night{booking.nights > 1 ? "s" : ""}
                        </p>
                      </div>

                      {/* Guests */}
                      <div className="text-sm text-gray-600">
                        {booking.guestsCount} guest
                        {booking.guestsCount > 1 ? "s" : ""}
                      </div>

                      {/* Amount */}
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          {booking.formattedAmount}
                        </p>
                        <p className="text-xs text-gray-400 capitalize">
                          {booking.paymentStatus}
                        </p>
                      </div>

                      {/* Status & Actions */}
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${S?.cls}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${S?.dot}`}
                          />
                          {S?.label}
                        </span>

                        <button
                          onClick={() => handleViewBooking(booking.id)}
                          className="ml-2 p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>

                        {booking.guestId && (
                          <button
                            onClick={() =>
                              handleMessageGuest(booking.guestId, booking)
                            }
                            disabled={isMessagingTarget(booking.id)}
                            className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Message Guest"
                          >
                            {isMessagingTarget(booking.id) ? (
                              <div className="w-4 h-4 border border-green-600 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <MessageCircle size={16} />
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Mobile View - Card Style */}
                    <div className="md:hidden p-4 space-y-3">
                      {/* Header with Guest and Status */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-sm shrink-0">
                            {booking.guest
                              .split(" ")
                              .map((w) => w[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900">
                              {booking.guest}
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                              {booking.guestEmail}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full border ${S?.cls} shrink-0 ml-2`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${S?.dot}`}
                          />
                          {S?.label}
                        </span>
                      </div>

                      {/* Property Details */}
                      <div className="pl-13 space-y-2">
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {booking.property}
                          </p>
                          {booking.location && (
                            <p className="text-xs text-gray-400">
                              {booking.location.city},{" "}
                              {booking.location.country}
                            </p>
                          )}
                        </div>

                        {/* Stay Info */}
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-gray-600">
                              {booking.dates}
                            </p>
                            <p className="text-xs text-gray-400">
                              {booking.nights} nights • {booking.guestsCount}{" "}
                              guests
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-base font-bold text-gray-900">
                              {booking.formattedAmount}
                            </p>
                            <p className="text-xs text-gray-400 capitalize">
                              {booking.paymentStatus}
                            </p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => handleViewBooking(booking.id)}
                            className="flex-1 px-3 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-1"
                          >
                            <Eye size={14} /> View Details
                          </button>
                          {booking.guestId && (
                            <button
                              onClick={() =>
                                handleMessageGuest(booking.guestId, booking)
                              }
                              disabled={isMessagingTarget(booking.id)}
                              className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isMessagingTarget(booking.id) ? (
                                <div className="w-3 h-3 border border-gray-600 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <MessageCircle size={14} />
                              )}
                              {isMessagingTarget(booking.id)
                                ? "Loading..."
                                : "Message"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Stat Card Component for Desktop
const StatCard = ({ label, count, color }) => {
  const colors = {
    blue: "bg-blue-50 border-blue-200",
    green: "bg-green-50 border-green-200",
    amber: "bg-amber-50 border-amber-200",
    teal: "bg-teal-50 border-teal-200",
    red: "bg-red-50 border-red-200",
  };

  const textColors = {
    blue: "text-blue-700",
    green: "text-green-700",
    amber: "text-amber-700",
    teal: "text-teal-700",
    red: "text-red-700",
  };

  return (
    <div
      className={`p-4 rounded-xl border ${colors[color]} transition-all hover:scale-105`}
    >
      <p className={`text-2xl font-bold ${textColors[color]}`}>{count}</p>
      <p className="text-xs text-gray-600 mt-1">{label}</p>
    </div>
  );
};

// Stat Card Component for Mobile
const StatCardMobile = ({ label, count, color }) => {
  const colors = {
    blue: "bg-blue-50",
    green: "bg-green-50",
    amber: "bg-amber-50",
  };

  const textColors = {
    blue: "text-blue-700",
    green: "text-green-700",
    amber: "text-amber-700",
  };

  return (
    <div className={`p-2 rounded-lg ${colors[color]} text-center`}>
      <p className={`text-lg font-bold ${textColors[color]}`}>{count}</p>
      <p className="text-[10px] text-gray-600">{label}</p>
    </div>
  );
};

export default BookingsPage;
