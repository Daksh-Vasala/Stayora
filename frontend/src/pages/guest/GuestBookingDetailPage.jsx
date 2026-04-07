// pages/BookingDetailPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  Bed,
  Bath,
  Home,
  Wifi,
  Car,
  Wind,
  Tv,
  Utensils,
  Shield,
  Thermometer,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Flag,
  Phone,
  Mail,
  Download,
  Info,
  RefreshCw,
} from "lucide-react";

const amenityIcons = {
  wifi: { icon: Wifi, label: "WiFi" },
  parking: { icon: Car, label: "Parking" },
  ac: { icon: Wind, label: "AC" },
  pool: { icon: Home, label: "Pool" },
  tv: { icon: Tv, label: "TV" },
  kitchen: { icon: Utensils, label: "Kitchen" },
  security: { icon: Shield, label: "24/7 Security" },
  heater: { icon: Thermometer, label: "Heater" },
};

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-700",
    icon: Clock,
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-green-100 text-green-700",
    icon: CheckCircle,
  },
  completed: {
    label: "Completed",
    color: "bg-blue-100 text-blue-700",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-700",
    icon: XCircle,
  },
};

const REFUND_CONFIG = {
  100: {
    color: "bg-green-100 text-green-700",
    icon: CheckCircle,
    label: "Full Refund",
  },
  75: {
    color: "bg-yellow-100 text-yellow-700",
    icon: RefreshCw,
    label: "75% Refund",
  },
  50: {
    color: "bg-orange-100 text-orange-700",
    icon: RefreshCw,
    label: "50% Refund",
  },
  0: { color: "bg-red-100 text-red-700", icon: XCircle, label: "No Refund" },
};

export default function GuestBookingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportData, setReportData] = useState({ reason: "", description: "" });
  const [submittingReport, setSubmittingReport] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelInfo, setCancelInfo] = useState(null);

  useEffect(() => {
    fetchBookingDetails();
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/bookings/${id}`);
      setBooking(response.data.data);
      if (response.data.data.refundInfo)
        setCancelInfo(response.data.data.refundInfo);
    } catch (error) {
      console.error("Error fetching booking:", error);
      toast.error(
        error.response?.data?.message || "Failed to load booking details",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    try {
      setCancelling(true);
      const response = await axios.patch(`/bookings/${id}/cancel`);
      toast.success(response.data.message || "Booking cancelled successfully");
      setShowCancelModal(false);
      fetchBookingDetails();
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    } finally {
      setCancelling(false);
    }
  };

  const handleSubmitReport = async () => {
    if (!reportData.reason) return toast.error("Please select a reason");
    try {
      setSubmittingReport(true);
      const response = await axios.post(`/bookings/${id}/report`, reportData);
      toast.success(
        response.data.message ||
          "Report submitted successfully. We'll investigate.",
      );
      setShowReportModal(false);
      setReportData({ reason: "", description: "" });
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error(error.response?.data?.message || "Failed to submit report");
    } finally {
      setSubmittingReport(false);
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const calculateNights = () =>
    booking
      ? Math.ceil(
          Math.abs(new Date(booking.checkOut) - new Date(booking.checkIn)) /
            (1000 * 60 * 60 * 24),
        )
      : 0;

  const getCancelEligibility = () => {
    if (!booking) return null;
    const checkInDate = new Date(booking.checkIn);
    const daysUntilCheckIn = Math.ceil(
      (checkInDate - new Date()) / (1000 * 60 * 60 * 24),
    );

    if (booking.status === "pending")
      return {
        canCancel: true,
        refundPercentage: 100,
        message: "Full refund guaranteed",
        color: "green",
      };
    if (booking.status === "confirmed") {
      if (daysUntilCheckIn > 7)
        return {
          canCancel: true,
          refundPercentage: 100,
          message: "Full refund (cancel 7+ days before check-in)",
          color: "green",
        };
      if (daysUntilCheckIn >= 3 && daysUntilCheckIn <= 7)
        return {
          canCancel: true,
          refundPercentage: 75,
          message: "75% refund (cancel 3-7 days before check-in)",
          color: "yellow",
        };
      if (daysUntilCheckIn > 0 && daysUntilCheckIn < 3)
        return {
          canCancel: true,
          refundPercentage: 50,
          message: "50% refund (cancel less than 3 days before check-in)",
          color: "red",
        };
    }
    if (booking.status === "completed" || checkInDate < new Date())
      return {
        canCancel: false,
        refundPercentage: 0,
        message: "Cannot cancel after check-in",
        color: "gray",
      };
    if (booking.status === "cancelled")
      return {
        canCancel: false,
        refundPercentage: booking.refundPercentage || 0,
        message: booking.cancellationMessage || "Booking already cancelled",
        color: "gray",
      };
    return {
      canCancel: false,
      refundPercentage: 0,
      message: "Cancellation not available",
      color: "gray",
    };
  };

  const canCancel = getCancelEligibility();
  const canReport =
    booking?.status === "confirmed" || booking?.status === "completed";
  const nights = calculateNights();

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  if (!booking)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">
            Booking not found
          </h2>
          <button
            onClick={() => navigate("/bookings")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Back to Bookings
          </button>
        </div>
      </div>
    );

  const property = booking.property;
  const StatusIcon = STATUS_CONFIG[booking.status]?.icon || Clock;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition mb-4"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">Back</span>
          </button>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Booking Details
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Booking ID: {booking._id.slice(-8)}
              </p>
            </div>
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${STATUS_CONFIG[booking.status]?.color}`}
            >
              <StatusIcon size={14} />
              <span className="text-sm font-medium capitalize">
                {booking.status}
              </span>
            </div>
          </div>
        </div>

        {booking.status === "cancelled" && booking.refundPercentage > 0 && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center gap-3">
              <CheckCircle size={20} className="text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">
                  Refund Processed: ₹{booking.refundAmount?.toLocaleString()} (
                  {booking.refundPercentage}%)
                </p>
                <p className="text-xs text-green-700 mt-0.5">
                  {booking.cancellationMessage}
                </p>
              </div>
            </div>
          </div>
        )}

        {booking.status === "cancelled" && booking.refundPercentage === 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center gap-3">
              <XCircle size={20} className="text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-800">
                  Booking Cancelled
                </p>
                <p className="text-xs text-red-700 mt-0.5">
                  {booking.cancellationMessage || "No refund applicable"}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="relative h-56">
                <img
                  src={
                    property.images?.[0]?.url ||
                    "https://placehold.co/800x400?text=No+Image"
                  }
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {property.title}
                </h2>
                <div className="flex items-center gap-2 text-gray-500 mb-4">
                  <MapPin size={16} />
                  <span className="text-sm">
                    {property.location?.address}, {property.location?.city},{" "}
                    {property.location?.country}
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {property.description}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                Amenities
              </h3>
              <div className="flex flex-wrap gap-2">
                {property.amenities?.map((amenity) => {
                  const AmenityIcon = amenityIcons[amenity]?.icon || Home;
                  const label = amenityIcons[amenity]?.label || amenity;
                  return (
                    <div
                      key={amenity}
                      className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg"
                    >
                      <AmenityIcon size={14} className="text-gray-500" />
                      <span className="text-xs text-gray-600">{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                Trip Details
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar size={18} className="text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Dates</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(booking.checkIn)} -{" "}
                      {formatDate(booking.checkOut)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {nights} nights
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users size={18} className="text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Guests</p>
                    <p className="text-sm text-gray-600">
                      {booking.guestsCount} guests
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                Price Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    ₹{property.pricePerNight.toLocaleString()} × {nights} nights
                  </span>
                  <span className="text-gray-900">
                    ₹{(property.pricePerNight * nights).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Service fee</span>
                  <span className="text-gray-900">₹0</span>
                </div>
                <div className="border-t border-gray-100 pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-bold text-xl text-gray-900">
                      ₹{booking.totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              {booking.status === "cancelled" && booking.refundAmount > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Refund Amount</span>
                    <span className="text-sm font-bold text-green-600">
                      ₹{booking.refundAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Payment Status</span>
                  <span
                    className={`text-sm font-medium capitalize ${booking.paymentStatus === "paid" ? "text-green-600" : booking.paymentStatus === "refunded" ? "text-blue-600" : "text-yellow-600"}`}
                  >
                    {booking.paymentStatus === "paid"
                      ? "Paid"
                      : booking.paymentStatus === "refunded"
                        ? "Refunded"
                        : "Pending"}
                  </span>
                </div>
              </div>
              {canCancel?.canCancel && (
                <div
                  className={`mt-4 p-3 rounded-lg text-xs ${canCancel.color === "green" ? "bg-green-50 text-green-700" : canCancel.color === "yellow" ? "bg-yellow-50 text-yellow-700" : "bg-red-50 text-red-700"}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Info size={12} />
                    <span className="font-medium">Cancellation Policy</span>
                  </div>
                  <p>{canCancel.message}</p>
                </div>
              )}
              <div className="mt-6 space-y-3">
                {canCancel?.canCancel && (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    disabled={cancelling}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition disabled:opacity-50"
                  >
                    <XCircle size={16} />
                    Cancel Booking
                  </button>
                )}
                {canReport && (
                  <button
                    onClick={() => setShowReportModal(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50 transition"
                  >
                    <Flag size={16} />
                    Report Issue
                  </button>
                )}
                <button
                  onClick={() => window.print()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition"
                >
                  <Download size={16} />
                  Download Invoice
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                Host Information
              </h3>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">
                    {booking.host?.name?.charAt(0) || "H"}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {booking.host?.name || "Host"}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <a
                      href={`mailto:${booking.host?.email}`}
                      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
                    >
                      <Mail size={12} />
                      Email
                    </a>
                    {booking.host?.phone && (
                      <a
                        href={`tel:${booking.host?.phone}`}
                        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
                      >
                        <Phone size={12} />
                        Call
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                Important Information
              </h4>
              <ul className="text-xs text-gray-600 space-y-2">
                <li>• Check-in: After 2:00 PM</li>
                <li>• Check-out: Before 11:00 AM</li>
                <li>• Free cancellation up to 7 days before check-in</li>
                <li>• 75% refund for 3-7 days before check-in</li>
                <li>• 50% refund for less than 3 days before check-in</li>
                <li>• Contact host for special requests</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <XCircle size={28} className="text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Cancel Booking?
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Are you sure you want to cancel this booking?
              </p>
            </div>
            <div
              className={`p-3 rounded-lg text-center text-sm mb-4 ${canCancel?.color === "green" ? "bg-green-50 text-green-700" : canCancel?.color === "yellow" ? "bg-yellow-50 text-yellow-700" : "bg-red-50 text-red-700"}`}
            >
              <p className="font-medium">{canCancel?.message}</p>
              {canCancel?.refundPercentage < 100 && (
                <p className="text-xs mt-1">
                  You will receive {canCancel?.refundPercentage}% refund
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancelBooking}
                disabled={cancelling}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-50"
              >
                {cancelling ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Report an Issue
              </h3>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Please describe the issue you're experiencing with this booking.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Issue Type *
                </label>
                <select
                  value={reportData.reason}
                  onChange={(e) =>
                    setReportData({ ...reportData, reason: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a reason</option>
                  <option value="property_not_as_described">
                    Property not as described
                  </option>
                  <option value="cleanliness_issues">Cleanliness issues</option>
                  <option value="host_unresponsive">Host unresponsive</option>
                  <option value="amenities_missing">Amenities missing</option>
                  <option value="payment_issue">Payment issue</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={reportData.description}
                  onChange={(e) =>
                    setReportData({
                      ...reportData,
                      description: e.target.value,
                    })
                  }
                  rows={4}
                  placeholder="Please provide details about the issue..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitReport}
                  disabled={submittingReport || !reportData.reason}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-50"
                >
                  {submittingReport ? "Submitting..." : "Submit Report"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
