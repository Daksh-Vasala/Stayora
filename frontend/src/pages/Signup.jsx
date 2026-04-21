import { Mail, Lock, User, Phone, Eye, EyeOff, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import Logo from "../components/layout/Logo";
import InputField from "../components/ui/InputField";
import LeftPanel from "../components/layout/LeftPanel";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { getUser } = useAuth();
  const [role, setRole] = useState("guest");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const { confirmPassword, ...userData } = data;
      if (role === "host") {
        userData.role = "host";
      }
      const res = await axios.post("/user/register", userData);
      getUser();
      console.log(res.data);
      toast.success(res.data.message);
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-50 p-4">
      <div className="grid lg:grid-cols-2 bg-white rounded-3xl shadow-xl max-w-4xl w-full overflow-hidden">
        <LeftPanel />

        <div className="p-10">
          <Logo />

          <h1 className="text-2xl font-bold mt-6 text-slate-900">
            Create account
          </h1>

          {/* Role selector */}
          <div className="mb-5">
            <p className="text-sm font-semibold text-slate-700 mb-2">
              I want to join as
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "guest", label: "Guest", sub: "Find & book stays" },
                { id: "host", label: "Host", sub: "List my property" },
              ].map(({ id, label, sub }) => (
                <button
                  key={id}
                  onClick={() => setRole(id)}
                  className={`flex flex-col items-start px-4 py-3 rounded-xl border-2 text-left transition-all cursor-pointer
                    ${
                      role === id
                        ? "border-blue-600 bg-blue-50"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                >
                  <span
                    className={`text-sm font-bold ${
                      role === id ? "text-blue-600" : "text-slate-800"
                    }`}
                  >
                    {label}
                  </span>
                  <span className="text-xs text-slate-500 mt-0.5">{sub}</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
            <InputField
              label="Name"
              icon={User}
              {...register("name", {
                required: "Name is required",
              })}
              error={errors.name?.message}
              placeholder={"Rahul Sharma"}
            />

            <InputField
              label="Email"
              icon={Mail}
              {...register("email", {
                required: "Email required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email",
                },
              })}
              error={errors.email?.message}
              placeholder={"rahul@example.com"}
            />

            <InputField
              label="Phone"
              icon={Phone}
              {...register("phone", {
                required: "Phone required",
                minLength: {
                  value: 10,
                  message: "Phone must be 10 digits",
                },
              })}
              error={errors.phone?.message}
              placeholder={"9876543210"}
            />

            <InputField
              label="Password"
              type={showPassword ? "text" : "password"}
              icon={Lock}
              {...register("password", {
                required: "Password required",
                minLength: {
                  value: 6,
                  message: "Min 6 characters",
                },
              })}
              error={errors.password?.message}
              placeholder={"Min 6 chars"}
              rightEl={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={16} className="text-slate-400" />
                  ) : (
                    <Eye size={16} className="text-slate-400" />
                  )}
                </button>
              }
            />

            <InputField
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              icon={Lock}
              {...register("confirmPassword", {
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              error={errors.confirmPassword?.message}
              placeholder={"repeat"}
              rightEl={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={16} className="text-slate-400" />
                  ) : (
                    <Eye size={16} className="text-slate-400" />
                  )}
                </button>
              }
            />

            <button
              type="submit"
              className={`w-full mt-4 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2 ${loading && "opacity-70"}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Please wait...
                </>
              ) : (
                "Sign up"
              )}
            </button>
          </form>

          {/* OR Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-slate-200"></div>
            <span className="text-sm text-slate-400">or</span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          <p className="text-sm mt-6 text-center text-slate-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
