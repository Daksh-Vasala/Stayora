// pages/BookingDetailPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { useMessaging } from "../../hooks/useMessaging";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
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
  Phone,
  Mail,
  Download,
  CreditCard,
  Star,
  MessageCircle,
  AlertOctagon,
  Home,
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

export default function GuestBookingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { messageAboutBooking, isMessaging } = useMessaging();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [disputeReason, setDisputeReason] = useState("");
  const [existingDispute, setExistingDispute] = useState(null);
  const [existingReview, setExistingReview] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 0, comment: "" });
  const [hoveredRating, setHoveredRating] = useState(0);

  useEffect(() => {
    loadAllData();
  }, [id]);

  const loadAllData = async () => {
    try {
      const [bookingRes] = await Promise.all([
        axios.get(`/bookings/${id}`),
        loadReview(),
        loadDispute(),
      ]);
      setBooking(bookingRes.data.data);
    } catch {
      toast.error("Failed to load booking");
    } finally {
      setLoading(false);
    }
  };

  const loadReview = async () => {
    try {
      const { data } = await axios.get(`/reviews/booking/${id}`);
      if (data.review) {
        setExistingReview(data.review);
        setReviewData({
          rating: data.review.rating,
          comment: data.review.comment,
        });
      }
    } catch {}
  };

  const loadDispute = async () => {
    try {
      const { data } = await axios.get(`/disputes/booking/${id}`);
      if (data.dispute) setExistingDispute(data.dispute);
    } catch {}
  };

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await axios.patch(`/bookings/${id}/cancel`);
      toast.success("Booking cancelled successfully");
      setShowCancelModal(false);
      loadAllData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel booking");
    } finally {
      setCancelling(false);
    }
  };

  const handleDispute = async () => {
    if (disputeReason.trim().length < 10) {
      toast.error("Please provide at least 10 characters");
      return;
    }
    try {
      await axios.post(`/disputes/${id}`, { reason: disputeReason });
      toast.success("Dispute submitted. Our team will review within 24 hours.");
      setShowDisputeModal(false);
      setDisputeReason("");
      loadDispute();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit dispute");
    }
  };

  const handleMessageHost = async () => {
    if (!user) {
      toast.error("Please login first");
      return navigate("/login");
    }
    if (booking?.host?._id === user.id) {
      return toast.info("You cannot message yourself");
    }

    await messageAboutBooking(booking.host._id, booking);
  };

  const handleSubmitReview = async () => {
    if (reviewData.rating === 0) return toast.error("Please select a rating");
    if (!reviewData.comment.trim()) return toast.error("Please write a review");

    try {
      if (existingReview) {
        await axios.put(`/reviews/${existingReview._id}`, reviewData);
        toast.success("Review updated successfully");
      } else {
        await axios.post(`/reviews/${id}`, reviewData);
        toast.success("Thank you for your review!");
      }
      setShowReviewModal(false);
      loadReview();
    } catch {
      toast.error("Failed to save review");
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getNights = () => {
    if (!booking) return 0;
    return Math.ceil(
      (new Date(booking.checkOut) - new Date(booking.checkIn)) /
        (1000 * 60 * 60 * 24),
    );
  };

  const canCancel = () => {
    if (!booking) return false;
    if (["cancelled", "completed"].includes(booking.status)) return false;
    if (new Date(booking.checkIn) < new Date()) return false;
    if (booking.status === "pending" && booking.paymentStatus === "unpaid")
      return true;
    if (booking.status === "confirmed" && booking.paymentStatus === "paid")
      return true;
    return false;
  };

  const getCancelPolicy = () => {
    if (!booking) return null;
    const daysLeft = Math.ceil(
      (new Date(booking.checkIn) - new Date()) / (1000 * 60 * 60 * 24),
    );

    if (booking.status === "pending" && booking.paymentStatus === "unpaid") {
      return {
        message: "Cancel for free",
        refund: "No payment made",
        color: "green",
      };
    }
    if (daysLeft > 7) {
      return {
        message: "Full refund",
        refund: `₹${booking.totalPrice}`,
        color: "green",
      };
    }
    if (daysLeft >= 3) {
      return {
        message: "Partial refund",
        refund: `₹${Math.round(booking.totalPrice * 0.75)} (75%)`,
        color: "yellow",
      };
    }
    return {
      message: "Partial refund",
      refund: `₹${Math.round(booking.totalPrice * 0.5)} (50%)`,
      color: "orange",
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">
            Booking not found
          </h2>
          <button
            onClick={() => navigate("/bookings")}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            View All Bookings
          </button>
        </div>
      </div>
    );
  }

  const property = booking.property;
  const host = booking.host;
  const nights = getNights();
  const subtotal = property.pricePerNight * nights;
  const tax = Math.round(subtotal * 0.05);
  const canReview =
    booking.status === "completed" && booking.paymentStatus === "paid";
  const canDispute =
    ["confirmed", "completed"].includes(booking.status) && !existingDispute;
  const cancelPolicy = getCancelPolicy();
  const isExpired =
    booking.expiresAt && new Date(booking.expiresAt) < new Date();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Navigation */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition" />
          <span>Back to Bookings</span>
        </button>

        {/* Title Section */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Booking Details
            </h1>
            <p className="text-gray-500 mt-1">
              Booking ID: #{booking._id.slice(-8).toUpperCase()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                booking.status === "confirmed"
                  ? "bg-green-100 text-green-700"
                  : booking.status === "completed"
                    ? "bg-blue-100 text-blue-700"
                    : booking.status === "cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
            <button
              onClick={() => window.print()}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title="Download Invoice"
            >
              <Download className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Alerts & Banners */}
        {existingDispute && (
          <div
            className={`mb-6 p-5 rounded-xl border-l-4 ${
              existingDispute.status === "open"
                ? "bg-orange-50 border-orange-500"
                : existingDispute.status === "resolved"
                  ? "bg-green-50 border-green-500"
                  : "bg-red-50 border-red-500"
            }`}
          >
            <div className="flex items-start gap-3">
              {existingDispute.status === "open" && (
                <AlertOctagon className="w-5 h-5 text-orange-600 mt-0.5" />
              )}
              {existingDispute.status === "resolved" && (
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              )}
              {existingDispute.status === "rejected" && (
                <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">
                  {existingDispute.status === "open" && "Dispute Under Review"}
                  {existingDispute.status === "resolved" && "Dispute Resolved"}
                  {existingDispute.status === "rejected" && "Dispute Rejected"}
                </h3>
                {existingDispute.resolution && (
                  <p className="text-sm text-gray-700 mt-1">
                    {existingDispute.resolution}
                  </p>
                )}
                {existingDispute.status === "open" && (
                  <p className="text-sm text-orange-700 mt-1">
                    Our team will respond within 24-48 hours.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {booking.status === "pending" && !isExpired && (
          <div className="mb-6 p-5 bg-linear-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-200">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-yellow-600" />
              <div>
                <h3 className="font-semibold text-yellow-900">
                  Complete Your Payment
                </h3>
                <p className="text-sm text-yellow-700">
                  Complete payment within 15 minutes to secure your booking.
                </p>
              </div>
            </div>
          </div>
        )}

        {booking.status === "cancelled" && (
          <div
            className={`mb-6 p-5 rounded-xl ${booking.refundAmount > 0 ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
          >
            <div className="flex items-center gap-3">
              {booking.refundAmount > 0 ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              <div>
                <h3 className="font-semibold text-gray-900">
                  {booking.refundAmount > 0
                    ? `Refund Processed: ₹${booking.refundAmount}`
                    : "Booking Cancelled"}
                </h3>
                <p className="text-sm text-gray-700">
                  {booking.cancellationMessage || "No refund applicable"}
                </p>
              </div>
            </div>
          </div>
        )}

        {canReview && (
          <div className="mb-6 p-5 bg-linear-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {existingReview
                      ? "You reviewed this property"
                      : "Share your experience"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {existingReview
                      ? "Edit your review anytime"
                      : "Help other travelers make informed decisions"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowReviewModal(true)}
                className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
              >
                {existingReview ? "Edit Review" : "Write a Review"}
              </button>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Property & Trip Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="relative h-64">
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
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {property.title}
                    </h2>
                    <div className="flex items-center gap-1 text-gray-600 mt-1">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">
                        {property.location?.city}, {property.location?.country}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      ₹{property.pricePerNight}
                    </p>
                    <p className="text-sm text-gray-500">per night</p>
                  </div>
                </div>

                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  {property.description}
                </p>

                <div className="border-t pt-4">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Amenities
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities?.map((amenity) => {
                      const Icon = amenityIcons[amenity] || Home;
                      return (
                        <div
                          key={amenity}
                          className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg text-sm"
                        >
                          <Icon className="w-4 h-4 text-gray-600" />
                          <span className="capitalize">{amenity}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Trip Details Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Trip Information
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Check-in</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(booking.checkIn)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">After 2:00 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Check-out</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(booking.checkOut)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Before 11:00 AM
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Guests</p>
                    <p className="font-medium text-gray-900">
                      {booking.guestsCount}{" "}
                      {booking.guestsCount === 1 ? "Guest" : "Guests"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium text-gray-900">
                      {nights} {nights === 1 ? "Night" : "Nights"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Existing Review Display */}
            {existingReview && canReview && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Your Review</h3>
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Edit
                  </button>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${star <= existingReview.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <p className="text-gray-700">{existingReview.comment}</p>
                <p className="text-xs text-gray-400 mt-3">
                  Posted on{" "}
                  {new Date(existingReview.createdAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Pricing & Actions */}
          <div className="space-y-6">
            {/* Price Summary Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Price Summary
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    ₹{property.pricePerNight.toLocaleString()} × {nights}{" "}
                    {nights === 1 ? "night" : "nights"}
                  </span>
                  <span className="font-medium">
                    ₹{subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes & fees (5% GST)</span>
                  <span className="font-medium">₹{tax.toLocaleString()}</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span>₹{booking.totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Payment Status</span>
                  <span
                    className={`text-sm font-medium px-3 py-1 rounded-full ${
                      booking.paymentStatus === "paid"
                        ? "bg-green-100 text-green-700"
                        : booking.paymentStatus === "refunded"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {booking.paymentStatus.charAt(0).toUpperCase() +
                      booking.paymentStatus.slice(1)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                {booking.status === "pending" &&
                  booking.paymentStatus === "unpaid" &&
                  !isExpired && (
                    <button
                      onClick={() =>
                        navigate(`/bookings/checkout/${booking._id}`)
                      }
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                    >
                      <CreditCard className="w-4 h-4" />
                      Pay ₹{booking.totalPrice.toLocaleString()}
                    </button>
                  )}

                {canCancel() && (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    disabled={cancelling}
                    className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-50"
                  >
                    {cancelling ? "Processing..." : "Cancel Booking"}
                  </button>
                )}

                {canDispute && (
                  <button
                    onClick={() => setShowDisputeModal(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-orange-500 text-orange-600 rounded-lg hover:bg-orange-50 transition font-medium"
                  >
                    <AlertOctagon className="w-4 h-4" />
                    Raise a Dispute
                  </button>
                )}
              </div>

              {/* Cancellation Policy Preview */}
              {canCancel() && cancelPolicy && (
                <div
                  className={`mt-4 p-4 rounded-lg ${
                    cancelPolicy.color === "green"
                      ? "bg-green-50 border border-green-200"
                      : cancelPolicy.color === "yellow"
                        ? "bg-yellow-50 border border-yellow-200"
                        : "bg-orange-50 border border-orange-200"
                  }`}
                >
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    Cancellation Policy
                  </p>
                  <p className="text-sm text-gray-700">
                    {cancelPolicy.message}
                  </p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {cancelPolicy.refund}
                  </p>
                </div>
              )}
            </div>

            {/* Host Information Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Host Information
              </h3>

              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md">
                  {host?.name?.[0]?.toUpperCase() || "H"}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h4 className="font-semibold text-gray-900">
                      {host?.name || "Host"}
                    </h4>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-gray-600">4.9</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    Member since{" "}
                    {host?.createdAt
                      ? new Date(host.createdAt).getFullYear()
                      : "2024"}
                  </p>

                  <div className="space-y-2 mb-4">
                    {host?.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <a
                          href={`tel:${host.phone}`}
                          className="text-gray-700 hover:text-blue-600"
                        >
                          {host.phone}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <a
                        href={`mailto:${host?.email}`}
                        className="text-gray-700 hover:text-blue-600"
                      >
                        {host?.email}
                      </a>
                    </div>
                    {host?.location && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">{host.location}</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleMessageHost}
                    disabled={isMessaging}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isMessaging ? (
                      <>
                        <div className="w-4 h-4 border border-gray-600 border-t-transparent rounded-full animate-spin" />
                        Messaging...
                      </>
                    ) : (
                      <>
                        <MessageCircle className="w-4 h-4" />
                        Message Host
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Important Info Card */}
            <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-blue-600" />
                Important Information
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                  Check-in: After 2:00 PM
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                  Check-out: Before 11:00 AM
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                  Free cancellation up to 7 days before check-in
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                  75% refund for 3-7 days before check-in
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                  50% refund for less than 3 days before check-in
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Cancel Booking?
              </h3>
              <p className="text-gray-600">This action cannot be undone.</p>
            </div>

            {cancelPolicy && (
              <div
                className={`p-4 rounded-lg mb-6 ${
                  cancelPolicy.color === "green"
                    ? "bg-green-50"
                    : cancelPolicy.color === "yellow"
                      ? "bg-yellow-50"
                      : "bg-orange-50"
                }`}
              >
                <p className="font-medium text-gray-900 mb-1">
                  {cancelPolicy.message}
                </p>
                <p className="text-sm text-gray-700">{cancelPolicy.refund}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-50"
              >
                {cancelling ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dispute Modal */}
      {showDisputeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-orange-600" />
                Raise a Dispute
              </h3>
              <button
                onClick={() => setShowDisputeModal(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Please describe your issue in detail. Our team will review and
              respond within 24-48 hours.
            </p>

            <div className="bg-yellow-50 rounded-lg p-3 mb-4">
              <p className="text-xs font-medium text-yellow-800 mb-1">
                Common reasons for disputes:
              </p>
              <ul className="text-xs text-yellow-700 space-y-1">
                <li>• Property not as described</li>
                <li>• Safety or cleanliness issues</li>
                <li>• Host misconduct</li>
                <li>• Payment issues</li>
              </ul>
            </div>

            <textarea
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              placeholder="Describe your issue in detail (minimum 10 characters)..."
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-500 mt-1 mb-6">
              {disputeReason.length} / 10 characters minimum
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDisputeModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDispute}
                className="flex-1 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium"
              >
                Submit Dispute
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {existingReview ? "Edit Your Review" : "Write a Review"}
              </h3>
              <button
                onClick={() => setShowReviewModal(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-900 font-medium">{property.title}</p>
              <p className="text-sm text-gray-500">
                {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() =>
                      setReviewData({ ...reviewData, rating: star })
                    }
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 transition ${
                        star <= (hoveredRating || reviewData.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review
              </label>
              <textarea
                value={reviewData.comment}
                onChange={(e) =>
                  setReviewData({ ...reviewData, comment: e.target.value })
                }
                placeholder="Share your experience with this property..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowReviewModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
              >
                {existingReview ? "Update Review" : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
