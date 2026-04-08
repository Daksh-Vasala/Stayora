// pages/BecomeHostPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Home,
  DollarSign,
  Users,
  Calendar,
  Shield,
  CheckCircle,
  ArrowRight,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

export default function BecomeHostPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const benefits = [
    { icon: DollarSign, title: "Earn Extra Income", desc: "Make money by listing your unused space" },
    { icon: Users, title: "Meet New People", desc: "Connect with travelers from around the world" },
    { icon: Calendar, title: "Flexible Schedule", desc: "Choose when your property is available" },
    { icon: Shield, title: "Host Protection", desc: "$1M liability insurance for hosts" },
  ];

  const requirements = [
    "Verified email address",
    "Valid phone number",
    "Property ownership proof or rental agreement",
    "Basic knowledge of hosting guidelines",
  ];

  const handleBecomeHost = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/user/become-host");
      toast.success(response.data.message || "Welcome to hosting! Redirecting to dashboard...");
      setTimeout(() => {
        navigate("/host/dashboard");
      }, 1500);
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "Failed to become host");
      setShowConfirm(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
            <Home size={28} className="text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Become a Host</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Share your space and start earning. Join thousands of hosts who make extra income
            by welcoming travelers from around the world.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Benefits */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Why become a host?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                      <benefit.icon size={18} className="text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{benefit.title}</h3>
                      <p className="text-sm text-gray-500">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">How it works</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <h3 className="font-medium mb-1">List your space</h3>
                  <p className="text-sm text-gray-500">Add photos, describe your place, set price</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  <h3 className="font-medium mb-1">Get bookings</h3>
                  <p className="text-sm text-gray-500">Travelers find and book your property</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">3</span>
                  </div>
                  <h3 className="font-medium mb-1">Host & earn</h3>
                  <p className="text-sm text-gray-500">Welcome guests and receive payments</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Requirements</h2>
              <div className="space-y-2">
                {requirements.map((req, i) => (
                  <div key={i} className="flex items-center gap-3 py-1">
                    <CheckCircle size={16} className="text-green-500" />
                    <span className="text-gray-600">{req}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - CTA Card */}
          <div className="lg:col-span-1">
            <div className="bg-orange-50 rounded-xl shadow-sm p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp size={32} className="text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Ready to start earning?</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Join our community of hosts and turn your space into income.
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Average monthly earnings</span>
                  <span className="font-semibold text-gray-900">₹25,000+</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Active hosts</span>
                  <span className="font-semibold text-gray-900">1,000+</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Booking rate</span>
                  <span className="font-semibold text-gray-900">94%</span>
                </div>
              </div>

              <button
                onClick={() => setShowConfirm(true)}
                className="w-full py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition flex items-center justify-center gap-2"
              >
                Get Started <ArrowRight size={16} />
              </button>

              <p className="text-xs text-center text-gray-500 mt-4">
                No commitment. Cancel anytime.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield size={28} className="text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold">Confirm Host Account</h3>
              <p className="text-sm text-gray-500 mt-1">
                By becoming a host, you'll be able to list properties and manage bookings.
              </p>
            </div>

            <div className="bg-yellow-50 p-3 rounded-lg mb-4">
              <div className="flex gap-2">
                <AlertCircle size={16} className="text-yellow-600 shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-800">
                  Make sure your email is verified and profile is complete before hosting.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2 border rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleBecomeHost}
                disabled={loading}
                className="flex-1 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition disabled:opacity-50"
              >
                {loading ? "Processing..." : "Yes, Become Host"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}