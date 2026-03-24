import { useState } from "react";
import { Link } from "react-router-dom";
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import axios from "axios";
import LeftPanel from "../components/layout/LeftPanel"; // ← your existing component
import Logo from "../components/layout/Logo";
import { useParams } from "react-router-dom";

const inp = `flex items-center gap-3 border rounded-xl px-4 py-3 transition-all`;
const focusCls = "border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-50";
const errCls   = "border-red-300 bg-red-50";

// ══════════════════════════════════════════════════════════════════════════════
//  RESET PASSWORD
//  Route: /reset-password?token=<token>
//  API:   POST /api/auth/reset-password  { token, password }
// ══════════════════════════════════════════════════════════════════════════════
export default function ResetPasswordPage() {
  const { token } = useParams();

  const [form,    setForm]    = useState({ password: "", confirm: "" });
  const [show,    setShow]    = useState({ pw: false, cf: false });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);

  const set  = k => e  => setForm(p => ({ ...p, [k]: e.target.value }));
  const togS = k => () => setShow(p => ({ ...p, [k]: !p[k] }));

  const validate = () => {
    const e = {};
    if (!form.password)                    e.password = "Password is required";
    else if (form.password.length < 6)     e.password = "At least 6 characters";
    if (!form.confirm)                     e.confirm  = "Please confirm your password";
    else if (form.confirm !== form.password) e.confirm = "Passwords don't match";
    return e;
  };

  const submit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({}); setLoading(true);
    try {
      await axios.post(`/user/reset-password/${token}`, { password: form.password });
      setDone(true);
    } catch {
      setErrors({ password: "Link expired or invalid. Please request a new one." });
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

          {done ? (
            // ── Success ──
            <div className="text-center">
              <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={24} className="text-green-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Password updated!</h2>
              <p className="text-sm text-gray-400 mb-7">You can now sign in with your new password.</p>
              <Link to="/login"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl text-sm no-underline transition-colors">
                Sign in
              </Link>
            </div>
          ) : (
            // ── Form ──
            <>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Reset password</h1>
              <p className="text-sm text-gray-400 mb-7">Choose a new password for your account.</p>

              <form onSubmit={submit} className="space-y-4">

                {/* New password */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">New password</label>
                  <div className={`${inp} ${errors.password ? errCls : focusCls}`}>
                    <Lock size={15} className="text-gray-300 shrink-0" />
                    <input
                      type={show.pw ? "text" : "password"}
                      value={form.password}
                      onChange={set("password")}
                      placeholder="Min. 6 characters"
                      className="flex-1 bg-transparent outline-none text-sm text-gray-900 placeholder:text-gray-300"
                    />
                    <button type="button" onClick={togS("pw")}
                      className="text-gray-300 hover:text-gray-500 border-none bg-transparent cursor-pointer transition-colors shrink-0">
                      {show.pw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-[11px] text-red-500 mt-1">{errors.password}</p>}
                </div>

                {/* Confirm password */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Confirm password</label>
                  <div className={`${inp} ${errors.confirm ? errCls : focusCls}`}>
                    <Lock size={15} className="text-gray-300 shrink-0" />
                    <input
                      type={show.cf ? "text" : "password"}
                      value={form.confirm}
                      onChange={set("confirm")}
                      placeholder="Repeat password"
                      className="flex-1 bg-transparent outline-none text-sm text-gray-900 placeholder:text-gray-300"
                    />
                    <button type="button" onClick={togS("cf")}
                      className="text-gray-300 hover:text-gray-500 border-none bg-transparent cursor-pointer transition-colors shrink-0">
                      {show.cf ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {errors.confirm && <p className="text-[11px] text-red-500 mt-1">{errors.confirm}</p>}
                </div>

                <button type="submit" disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 border-none cursor-pointer transition-colors mt-1">
                  {loading
                    ? <><Loader2 size={15} className="animate-spin" /> Updating...</>
                    : "Update password"
                  }
                </button>
              </form>

              <Link to="/login"
                className="mt-6 text-sm text-gray-400 hover:text-blue-600 flex items-center gap-1.5 no-underline transition-colors w-fit">
                <ArrowLeft size={13} /> Back to sign in
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}