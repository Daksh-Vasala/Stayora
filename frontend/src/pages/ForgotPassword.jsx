import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle,
  Loader2,
  Home,
} from "lucide-react";
import axios from "axios";
import LeftPanel from "../components/layout/LeftPanel"; // ← your existing component
import Logo from "../components/layout/Logo";

const inp = `flex items-center gap-3 border rounded-xl px-4 py-3 transition-all`;
const focusCls =
  "border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-50";
const errCls = "border-red-300 bg-red-50";

// ══════════════════════════════════════════════════════════════════════════════
//  FORGOT PASSWORD
//  Route: /forgot-password
//  API:   POST /api/auth/forgot-password  { email }
// ══════════════════════════════════════════════════════════════════════════════
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Enter a valid email.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await axios.post("/user/forgot-password", { email });
      setSent(true);
    } catch(error) {
      setError("Something went wrong. Please try again.");
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden grid lg:grid-cols-2">
        <LeftPanel />

        {/* Right panel */}
        <div className="flex flex-col justify-center px-8 py-10 sm:px-10">
          <Logo />

          {sent ? (
            // ── Success state ──
            <div className="text-center">
              <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={24} className="text-green-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                Check your inbox
              </h2>
              <p className="text-sm text-gray-400 mb-1">
                We sent a reset link to
              </p>
              <p className="text-sm font-semibold text-gray-800 mb-6">
                {email}
              </p>
              <p className="text-xs text-gray-400 mb-8">
                Didn't get it?{" "}
                <button
                  onClick={() => setSent(false)}
                  className="text-blue-600 font-semibold hover:underline border-none bg-transparent cursor-pointer"
                >
                  Resend
                </button>
              </p>
              <Link
                to="/login"
                className="text-sm text-gray-400 hover:text-blue-600 flex items-center justify-center gap-1.5 no-underline transition-colors"
              >
                <ArrowLeft size={13} /> Back to sign in
              </Link>
            </div>
          ) : (
            // ── Form ──
            <>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Forgot password?
              </h1>
              <p className="text-sm text-gray-400 mb-7">
                We'll send a reset link to your email.
              </p>

              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Email
                  </label>
                  <div className={`${inp} ${error ? errCls : focusCls}`}>
                    <Mail size={15} className="text-gray-300 shrink-0" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                      placeholder="rahul@example.com"
                      className="flex-1 bg-transparent outline-none text-sm text-gray-900 placeholder:text-gray-300"
                    />
                  </div>
                  {error && (
                    <p className="text-[11px] text-red-500 mt-1">{error}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 border-none cursor-pointer transition-colors"
                >
                  {loading ? (
                    <>
                      <Loader2 size={15} className="animate-spin" /> Sending...
                    </>
                  ) : (
                    "Send reset link"
                  )}
                </button>
              </form>

              <Link
                to="/login"
                className="mt-6 text-sm text-gray-400 hover:text-blue-600 flex items-center gap-1.5 no-underline transition-colors w-fit"
              >
                <ArrowLeft size={13} /> Back to sign in
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
