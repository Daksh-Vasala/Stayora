import React, { useState } from "react";
import axios from "axios";
import { CheckCircle } from "lucide-react";

const PaymentButton = ({ bookingId, amount }) => {
  const [loading, setLoading] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);

    const isLoaded = await loadRazorpayScript();

    if (!isLoaded) {
      alert("Razorpay SDK failed to load");
      setLoading(false);
      return;
    }

    try {
      // 🔹 Create order
      const { data } = await axios.post("/payments/create-order", {
        bookingId,
      });

      console.log(data);

      const options = {
        key: import.meta.env.VITE_API_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: "INR",
        name: "Stayora",
        description: "Booking Payment",
        order_id: data.order.id,

        handler: async function (response) {
          try {
            await axios.post("/payments/verify-payment", response);

            // ✅ Success
            window.location.href = `/bookings/success/${bookingId}`;
          } catch (err) {
            console.error(err);
            alert("Verification failed");
          }
        },

        prefill: {
          name: "Daksh",
          email: "test@email.com",
        },

        method: {
          upi: true, // ✅ ADD THIS
          card: true,
          netbanking: true,
          wallet: true,
        },

        theme: {
          color: "#6366f1",
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        console.error(response.error);
        alert("Payment failed. Try again.");
      });

      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 
        ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 active:scale-95"
        }`}
    >
      {loading ? (
        <>
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          Processing...
        </>
      ) : (
        <><CheckCircle size={18} /> Pay ₹{amount}</>
      )}
    </button>
  );
};

export default PaymentButton;
