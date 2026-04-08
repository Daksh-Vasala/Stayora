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
  CreditCard,
} from "lucide-react";

const amenityIcons = {
  wifi: Wifi,
  parking: Car,
  ac: Wind,
  tv: Tv,
  kitchen: Utensils,
  security: Shield,
  heater: Thermometer,
};

const STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-green-100 text-green-700",
  completed: "bg-blue-100 text-blue-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function GuestBookingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const fetchBooking = async () => {
    try {
      const { data } = await axios.get(`/bookings/${id}`);
      setBooking(data.data);
    } catch (err) {
      toast.error("Failed to load booking");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      setCancelling(true);
      const { data } = await axios.patch(`/bookings/${id}/cancel`);
      toast.success(data.message);
      setShowCancelModal(false);
      fetchBooking();
    } catch (err) {
      toast.error(err.response?.data?.message || "Cancel failed");
    } finally {
      setCancelling(false);
    }
  };

  const handleReport = async () => {
    if (!reportReason) return toast.error("Select a reason");
    try {
      await axios.post(`/bookings/${id}/report`, { reason: reportReason });
      toast.success("Report submitted");
      setShowReportModal(false);
      setReportReason("");
    } catch (err) {
      toast.error("Failed to submit");
    }
  };

  const getCancelInfo = () => {
    if (!booking) return null;
    const daysLeft = Math.ceil((new Date(booking.checkIn) - new Date()) / (86400000));

    if (booking.status === "cancelled") {
      return { canCancel: false, msg: booking.cancellationMessage || "Already cancelled", color: "gray" };
    }
    if (booking.status === "completed") {
      return { canCancel: false, msg: "Trip completed", color: "gray" };
    }
    if (new Date(booking.checkIn) < new Date()) {
      return { canCancel: false, msg: "Cannot cancel after check-in", color: "gray" };
    }

    // Pending unpaid - cancel for free
    if (booking.status === "pending" && booking.paymentStatus === "unpaid") {
      return { canCancel: true, msg: "Cancel for free (no payment made)", color: "green", refund: 0 };
    }

    // Confirmed with payment - refund based on days
    if (booking.status === "confirmed" && booking.paymentStatus === "paid") {
      if (daysLeft > 7) {
        return { canCancel: true, msg: `100% refund of ₹${booking.totalPrice}`, color: "green", refund: 100 };
      }
      if (daysLeft >= 3) {
        return { canCancel: true, msg: `75% refund of ₹${Math.round(booking.totalPrice * 0.75)}`, color: "yellow", refund: 75 };
      }
      if (daysLeft > 0) {
        return { canCancel: true, msg: `50% refund of ₹${Math.round(booking.totalPrice * 0.5)}`, color: "red", refund: 50 };
      }
    }

    return { canCancel: false, msg: "Cancellation not available", color: "gray" };
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const nights = booking
    ? Math.ceil((new Date(booking.checkOut) - new Date(booking.checkIn)) / 86400000)
    : 0;

  const cancelInfo = getCancelInfo();
  const canReport = ["confirmed", "completed"].includes(booking?.status);
  const showPayButton = booking?.status === "pending" && booking?.paymentStatus === "unpaid";
  const isExpired = booking?.expiresAt && new Date(booking.expiresAt) < new Date();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold">Booking not found</h2>
          <button onClick={() => navigate("/bookings")} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">
            Back to Bookings
          </button>
        </div>
      </div>
    );
  }

  const property = booking.property;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 mb-4 hover:text-gray-900">
          <ArrowLeft size={18} /> Back
        </button>

        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold">Booking Details</h1>
            <p className="text-sm text-gray-500">ID: {booking._id.slice(-8)}</p>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${STATUS_STYLES[booking.status]}`}>
            {booking.status === "pending" ? <Clock size={14} /> : <CheckCircle size={14} />}
            <span className="text-sm font-medium capitalize">{booking.status}</span>
          </div>
        </div>

        {/* Expiry Warning for Pending Payment */}
        {showPayButton && !isExpired && (
          <div className="mb-6 p-4 bg-yellow-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Clock size={20} className="text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Complete your payment</p>
                <p className="text-xs text-yellow-700 mt-0.5">
                  Complete payment within 15 minutes or your booking will be cancelled.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Expired Booking Banner */}
        {showPayButton && isExpired && (
          <div className="mb-6 p-4 bg-red-50 rounded-xl">
            <div className="flex items-center gap-3">
              <XCircle size={20} className="text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-800">Booking Expired</p>
                <p className="text-xs text-red-700 mt-0.5">
                  Payment window has expired. This booking has been cancelled.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Cancelled Banner */}
        {booking.status === "cancelled" && (
          <div className={`mb-6 p-4 rounded-xl ${booking.refundAmount > 0 ? "bg-green-50" : "bg-red-50"}`}>
            <div className="flex items-center gap-3">
              {booking.refundAmount > 0 ? <CheckCircle size={20} className="text-green-600" /> : <XCircle size={20} className="text-red-600" />}
              <div>
                <p className="text-sm font-medium">
                  {booking.refundAmount > 0 ? `Refund: ₹${booking.refundAmount} (${booking.refundPercentage}%)` : "Booking Cancelled"}
                </p>
                <p className="text-xs mt-0.5">{booking.cancellationMessage || "No refund applicable"}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-xl shadow-sm p-5">
              <img
                src={property.images?.[0]?.url || "https://placehold.co/800x400?text=No+Image"}
                alt={property.title}
                className="w-full h-56 object-cover rounded-lg mb-4"
              />
              <h2 className="text-xl font-bold mb-2">{property.title}</h2>
              <p className="text-gray-500 text-sm flex items-center gap-1 mb-3">
                <MapPin size={14} /> {property.location?.city}, {property.location?.country}
              </p>
              <p className="text-gray-600 text-sm">{property.description}</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="font-semibold mb-3">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {property.amenities?.map((a) => {
                  const Icon = amenityIcons[a] || Home;
                  return (
                    <div key={a} className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm">
                      <Icon size={14} /> {a}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="font-semibold mb-3">Trip Details</h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <Calendar size={18} className="text-blue-500" />
                  <div>
                    {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                    <br />
                    <span className="text-xs text-gray-400">{nights} nights</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Users size={18} className="text-blue-500" />
                  <div>{booking.guestsCount} guests</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="bg-white rounded-xl shadow-sm p-5 sticky top-24">
              <h3 className="font-semibold mb-3">Price Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>₹{property.pricePerNight} × {nights} nights</span>
                  <span>₹{property.pricePerNight * nights}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service fee</span>
                  <span>₹0</span>
                </div>
                <div className="pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>₹{booking.totalPrice}</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 flex justify-between text-sm">
                <span>Payment Status</span>
                <span
                  className={`capitalize ${
                    booking.paymentStatus === "paid"
                      ? "text-green-600"
                      : booking.paymentStatus === "refunded"
                      ? "text-blue-600"
                      : "text-yellow-600"
                  }`}
                >
                  {booking.paymentStatus}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 space-y-3">
                {/* Pay Now Button */}
                {showPayButton && !isExpired && (
                  <button
                    onClick={() => navigate(`/bookings/checkout/${booking._id}`)}
                    className="w-full py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition flex items-center justify-center gap-2"
                  >
                    <CreditCard size={16} />
                    Pay Now (₹{booking.totalPrice.toLocaleString()})
                  </button>
                )}

                {/* Cancel Button */}
                {cancelInfo.canCancel && (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    disabled={cancelling}
                    className="w-full py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-50"
                  >
                    Cancel Booking
                  </button>
                )}

                {/* Report Button */}
                {canReport && (
                  <button
                    onClick={() => setShowReportModal(true)}
                    className="w-full py-2.5 text-red-600 rounded-lg font-medium hover:bg-red-50 transition"
                  >
                    <Flag size={14} className="inline mr-1" /> Report Issue
                  </button>
                )}

                {/* Download Invoice */}
                <button
                  onClick={() => window.print()}
                  className="w-full py-2.5 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  <Download size={14} className="inline mr-1" /> Download Invoice
                </button>
              </div>

              {/* Cancellation Policy Info */}
              {cancelInfo.canCancel && cancelInfo.refund > 0 && (
                <div className="mt-4 p-3 rounded-lg text-xs bg-blue-50 text-blue-700">
                  <p className="font-medium mb-1">Cancellation Policy</p>
                  <p>{cancelInfo.msg}</p>
                </div>
              )}
            </div>

            {/* Host Info */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="font-semibold mb-3">Host Information</h3>
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold">
                  {booking.host?.name?.[0] || "H"}
                </div>
                <div>
                  <p className="font-medium">{booking.host?.name || "Host"}</p>
                  <div className="flex gap-2 mt-1">
                    <a href={`mailto:${booking.host?.email}`} className="text-xs text-blue-600">
                      <Mail size={12} className="inline" /> Email
                    </a>
                    {booking.host?.phone && (
                      <a href={`tel:${booking.host?.phone}`} className="text-xs text-blue-600">
                        <Phone size={12} className="inline" /> Call
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Important Info */}
            <div className="bg-blue-50 rounded-xl p-4">
              <h4 className="text-sm font-semibold mb-2">Important Information</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Check-in: After 2:00 PM</li>
                <li>• Check-out: Before 11:00 AM</li>
                <li>• Free cancellation up to 7 days before</li>
                <li>• 75% refund for 3-7 days before</li>
                <li>• 50% refund for less than 3 days</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <XCircle size={28} className="text-red-600" />
              </div>
              <h3 className="text-lg font-semibold">Cancel Booking?</h3>
              <p className="text-sm text-gray-500">This action cannot be undone.</p>
            </div>
            <div
              className={`p-3 rounded-lg text-center text-sm mb-4 ${
                cancelInfo?.color === "green"
                  ? "bg-green-50 text-green-700"
                  : cancelInfo?.color === "yellow"
                  ? "bg-yellow-50 text-yellow-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              <p className="font-medium">{cancelInfo?.msg}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowCancelModal(false)} className="flex-1 py-2 border rounded-lg">
                Keep Booking
              </button>
              <button onClick={handleCancel} disabled={cancelling} className="flex-1 py-2 bg-red-600 text-white rounded-lg">
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Report Issue</h3>
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full p-2 rounded-lg mb-4 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select reason</option>
              <option value="property_not_as_described">Not as described</option>
              <option value="cleanliness_issues">Cleanliness issues</option>
              <option value="host_unresponsive">Host unresponsive</option>
              <option value="other">Other</option>
            </select>
            <div className="flex gap-3">
              <button onClick={() => setShowReportModal(false)} className="flex-1 py-2 rounded-lg bg-gray-100">
                Cancel
              </button>
              <button onClick={handleReport} className="flex-1 py-2 bg-red-600 text-white rounded-lg">
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}