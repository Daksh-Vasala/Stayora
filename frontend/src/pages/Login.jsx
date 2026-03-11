import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";

import Logo from "../components/Logo";
import InputField from "../components/InputField";
import LeftPanel from "../components/LeftPanel";
import { toast } from "react-toastify";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitHandler = async (data) => {
    try {
      setLoading(true);
      const res = await axios.post("/user/login", data);
      console.log(res.data);
      toast.success(res.data?.message);
      navigate("/user");
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
            Welcome back
          </h1>

          <form
            onSubmit={handleSubmit(submitHandler)}
            className="space-y-4 mt-6"
          >
            <InputField
              label="Email"
              icon={Mail}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email",
                },
              })}
              error={errors.email?.message}
              placeholder="rahul@example.com"
            />

            <InputField
              label="Password"
              type={showPassword ? "text" : "password"}
              icon={Lock}
              {...register("password", {
                required: "Password is required",
              })}
              error={errors.password?.message}
              placeholder="Enter your password"
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

            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-xs text-blue-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className={`w-full mt-2 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-sm ${loading && "opacity-50"}`}
              disabled={loading}
            >
              {loading ? "Please wait..." : "Sign in"}
            </button>
          </form>

          {/* OR Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-slate-200"></div>
            <span className="text-sm text-slate-400">or</span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          {/* Google Sign In */}
          <button className="w-full mt-6 border text-sm border-slate-300 py-3 rounded-xl flex items-center justify-center gap-4 hover:bg-slate-50 transition-colors">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-5 h-5"
            />
            Sign in with Google
          </button>

          <p className="text-sm mt-6 text-center text-slate-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 font-semibold hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
