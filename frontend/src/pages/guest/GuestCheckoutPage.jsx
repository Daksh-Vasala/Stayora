// GuestCheckoutPage.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Calendar,
  Users,
  CreditCard,
  Shield,
  CheckCircle,
  AlertCircle,
  MapPin,
  Home,
  ArrowLeft,
  Wallet,
  Lock,
  ChevronRight,
  Clock,
  User,
} from "lucide-react";
import PaymentButton from "../../components/layout/PaymentButton";

export default function GuestCheckoutPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("card");

  useEffect(() => {
    fetchBookingDetails();
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/bookings/${id}`);
      console.log("Booking details:", response.data);
      setBooking(response.data.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching booking details:", err);
      setError(err.response?.data?.message || "Failed to load booking details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Calculate nights
  const calculateNights = () => {
    if (!booking) return 0;
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);
    const diffTime = Math.abs(checkOut - checkIn);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Calculate breakdown (only subtotal + tax)
  const calculateBreakdown = () => {
    if (!booking) return null;
    
    const nights = calculateNights();
    const subtotal = booking.property.pricePerNight * nights;
    const taxRate = 0.05; // 5% tax
    const taxes = Math.round(subtotal * taxRate);
    
    return {
      nights,
      subtotal,
      taxes,
      total: subtotal + taxes,
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error || "Unable to load booking details"}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const breakdown = calculateBreakdown();
  const property = booking.property;
  const isExpired = new Date(booking.expiresAt) < new Date();

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition mb-4"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">Back</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Complete your booking</h1>
          <p className="text-gray-500 mt-1">Review your details and confirm payment</p>
        </div>

        {/* Expiry Warning */}
        {isExpired && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-red-600" size={20} />
              <div>
                <p className="text-sm font-medium text-red-800">Booking session expired</p>
                <p className="text-xs text-red-600 mt-0.5">
                  This booking has expired. Please create a new booking.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Booking Details */}
          <div className="lg:col-span-2 space-y-5">
            {/* Property Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
              <div className="flex gap-4">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  <img
                    src={property.images?.[0]?.url || "https://placehold.co/400x300?text=No+Image"}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{property.title}</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                    <MapPin size={14} className="text-gray-400" />
                    <span>{property.location?.city}, {property.location?.country}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-1">
                      <Home size={14} className="text-gray-400" />
                      <span className="capitalize">{property.propertyType}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={14} className="text-gray-400" />
                      <span>{booking.guestsCount} guests</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Guest Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Guest information</h3>
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <User size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{booking.guest?.name}</p>
                  <p className="text-sm text-gray-600 mt-0.5">{booking.guest?.email}</p>
                  {booking.guest?.phone && (
                    <p className="text-sm text-gray-600 mt-0.5">{booking.guest?.phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Your trip</h3>
              
              <div className="space-y-4">
                {/* Dates */}
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <Calendar size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Dates</p>
                    <p className="text-sm text-gray-600 mt-0.5">
                      {new Date(booking.checkIn).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })} - {new Date(booking.checkOut).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {breakdown?.nights} nights
                    </p>
                  </div>
                </div>

                {/* Guests */}
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <Users size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Guests</p>
                    <p className="text-sm text-gray-600 mt-0.5">
                      {booking.guestsCount} {booking.guestsCount === 1 ? 'guest' : 'guests'}
                    </p>
                  </div>
                </div>

                {/* Booking Status */}
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <Clock size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Booking Status</p>
                    <p className="text-sm text-gray-600 mt-0.5 capitalize">
                      {booking.status}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cancellation Policy */}
            <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
              <div className="flex gap-3">
                <Shield size={20} className="text-blue-600 shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Free cancellation</h4>
                  <p className="text-xs text-gray-600">
                    Cancel up to 7 days before check-in for a full refund.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Price Summary & Payment */}
          <div className="space-y-5">
            {/* Price Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sticky top-24">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Price details</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    ₹{property.pricePerNight.toLocaleString()} × {breakdown?.nights} nights
                  </span>
                  <span className="text-gray-900">
                    ₹{breakdown?.subtotal?.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (GST 5%)</span>
                  <span className="text-gray-900">
                    ₹{breakdown?.taxes?.toLocaleString()}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Total (INR)</span>
                    <span className="font-bold text-xl text-gray-900">
                      ₹{booking.totalPrice?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Status */}
              <div className="mt-4 pt-4 mb-4 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Payment Status</span>
                  <span className={`text-sm font-medium capitalize ${
                    booking.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {booking.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                  </span>
                </div>
              </div>

              {booking.paymentStatus !== 'paid' && !isExpired && (
                <>
                  {/* Pay Button */}
                  <PaymentButton bookingId={booking._id} amount={booking.totalPrice} />
                </>
              )}

              {/* Already Paid Message */}
              {booking.paymentStatus === 'paid' && (
                <div className="mt-6 bg-green-50 rounded-xl p-4 text-center">
                  <CheckCircle className="text-green-600 mx-auto mb-2" size={24} />
                  <p className="text-sm font-medium text-green-800">Payment Completed</p>
                  <p className="text-xs text-green-600 mt-1">Your booking is confirmed</p>
                  <button
                    onClick={() => navigate(`/bookings/success/${booking._id}`)}
                    className="mt-3 text-sm text-green-700 font-medium hover:underline"
                  >
                    View Booking Details →
                  </button>
                </div>
              )}

              {/* Expired Message */}
              {isExpired && booking.paymentStatus !== 'paid' && (
                <div className="mt-6 bg-red-50 rounded-xl p-4 text-center">
                  <AlertCircle className="text-red-600 mx-auto mb-2" size={24} />
                  <p className="text-sm font-medium text-red-800">Booking Expired</p>
                  <p className="text-xs text-red-600 mt-1">Please create a new booking</p>
                  <button
                    onClick={() => navigate(`/property/${property._id}`)}
                    className="mt-3 text-sm text-red-700 font-medium hover:underline"
                  >
                    Book Again →
                  </button>
                </div>
              )}

              {/* Secure Notice */}
              <p className="text-xs text-center text-gray-400 mt-4 flex items-center justify-center gap-1">
                <Lock size={12} />
                Your payment is secure and encrypted
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}