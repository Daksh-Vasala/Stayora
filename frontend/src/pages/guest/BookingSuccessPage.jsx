// pages/BookingSuccessPage.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  CheckCircle,
  Calendar,
  Users,
  MapPin,
  Home,
  Clock,
  Mail,
  Download,
  Printer,
  ArrowRight,
  Share2,
  Heart,
} from "lucide-react";

export default function GuestBookingSuccessPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get booking from location state or fetch from API
    if (location.state?.booking) {
      setBooking(location.state.booking);
      setLoading(false);
    } else if (id) {
      fetchBookingDetails();
    } else {
      navigate("/bookings");
    }
  }, [id, location]);

  const fetchBookingDetails = async () => {
    try {
      const { data } = await axios.get(`/bookings/${id}`);
      setBooking(data.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load booking details");
      navigate("/bookings");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Booking Confirmation - Stayora",
        text: `Your booking for ${booking?.property?.title} is confirmed!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Booking not found</h2>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const property = booking.property;
  const nights = Math.ceil(
    (new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24)
  );
  
  // Calculate breakdown
  const subtotal = property.pricePerNight * nights;
  const taxRate = 0.05; // 5% tax
  const taxes = Math.round(subtotal * taxRate);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-green-500 to-green-600 px-6 py-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4">
              <CheckCircle size={40} className="text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Booking Confirmed! 🎉</h1>
            <p className="text-green-100">
              Your booking has been successfully confirmed
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Booking ID */}
            <div className="text-center mb-6">
              <p className="text-sm text-gray-500">Booking ID</p>
              <p className="text-lg font-mono font-semibold text-gray-900">
                {booking._id.slice(-8).toUpperCase()}
              </p>
            </div>

            {/* Property Info */}
            <div className="border-t border-gray-100 pt-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h2>
              <div className="flex gap-4">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  <img
                    src={property.images?.[0]?.url || "https://placehold.co/400x300?text=No+Image"}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{property.title}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                    <MapPin size={12} />
                    {property.location?.city}, {property.location?.country}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Home size={12} /> {property.propertyType}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={12} /> {booking.guestsCount} guests
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Trip Details */}
            <div className="border-t border-gray-100 pt-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Trip Details</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Calendar size={18} className="text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Dates</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{nights} nights</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={18} className="text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Check-in / Check-out</p>
                    <p className="text-sm text-gray-600">Check-in: After 2:00 PM</p>
                    <p className="text-sm text-gray-600">Check-out: Before 11:00 AM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Summary - Updated with tax only */}
            <div className="border-t border-gray-100 pt-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    ₹{property.pricePerNight.toLocaleString()} × {nights} nights
                  </span>
                  <span className="text-gray-900">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (GST 5%)</span>
                  <span className="text-gray-900">₹{taxes.toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-100 pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span className="text-gray-900">Total Paid</span>
                    <span className="text-xl font-bold text-green-600">
                      ₹{booking.totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t border-gray-100 pt-6">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  onClick={handlePrint}
                  className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  <Printer size={16} />
                  Print
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  <Share2 size={16} />
                  Share
                </button>
              </div>

              <button
                onClick={() => navigate("/bookings")}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                View My Bookings
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* What's Next Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">What's next?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Mail size={20} className="text-blue-600" />
              </div>
              <h4 className="text-sm font-medium text-gray-900">Confirmation Email</h4>
              <p className="text-xs text-gray-500 mt-1">
                We've sent booking details to your email
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart size={20} className="text-blue-600" />
              </div>
              <h4 className="text-sm font-medium text-gray-900">Enjoy Your Stay</h4>
              <p className="text-xs text-gray-500 mt-1">
                Get ready for an amazing experience
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock size={20} className="text-blue-600" />
              </div>
              <h4 className="text-sm font-medium text-gray-900">Need Help?</h4>
              <p className="text-xs text-gray-500 mt-1">
                Contact support anytime 24/7
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}