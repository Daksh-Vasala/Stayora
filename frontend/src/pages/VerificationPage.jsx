// pages/VerifyEmail.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react";

export default function VerificationPage() {
  const navigate = useNavigate();
  const { token } = useParams();

  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link. No token provided.");
      return;
    }
    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    try {
      const response = await axios.post("/user/verify-email", { token });

      if (response.data.success) {
        setStatus("success");
        setMessage(response.data.message || "Email verified successfully!");

        // Auto redirect after 5 seconds
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              navigate("/profile");
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setStatus("error");
        setMessage(response.data.message || "Verification failed");
      }
    } catch (error) {
      console.error("Verification error:", error);
      setStatus("error");
      setMessage(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    }
  };

  const resendVerification = async () => {
    try {
      // You can implement resend logic here
      const response = await axios.post("/api/auth/resend-verification", {
        email: "user@example.com",
      });
      alert("Verification email resent! Please check your inbox.");
    } catch (error) {
      console.error("Resend error:", error);
      alert("Failed to resend verification email.");
    }
  };

  if (status === "verifying") {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
              <Loader2 size={40} className="text-blue-500 animate-spin" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Verifying your email
          </h2>
          <p className="text-gray-500">
            Please wait while we verify your email address...
          </p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
              <CheckCircle size={40} className="text-green-500" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Email Verified! 🎉
          </h2>
          <p className="text-gray-500 mb-6">{message}</p>
          <p className="text-sm text-gray-400 mb-6">
            Redirecting to profile in {countdown} seconds...
          </p>
          <button
            onClick={() => navigate("/profile")}
            className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-medium hover:bg-blue-700 transition"
          >
            Go to Profile Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
            <XCircle size={40} className="text-red-500" />
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Verification Failed
        </h2>
        <p className="text-gray-500 mb-6">{message}</p>
        <div className="space-y-3">
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-medium hover:bg-blue-700 transition"
          >
            Go to Login
          </button>
          <button
            onClick={resendVerification}
            className="w-full bg-gray-100 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition"
          >
            Resend Verification Email
          </button>
        </div>
      </div>
    </div>
  );
}
