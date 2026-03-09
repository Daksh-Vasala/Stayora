import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

import Logo from "../components/Logo";
import InputField from "../components/InputField";
import LeftPanel from "../components/LeftPanel";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-stone-50 p-4">
      <div className="grid lg:grid-cols-2 bg-white rounded-3xl shadow-xl max-w-4xl w-full overflow-hidden">
        <LeftPanel />

        <div className="p-10">
          <Logo />

          <h1 className="text-2xl font-bold mt-6">Welcome back</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
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
                    <EyeOff size={16} className="text-stone-400" />
                  ) : (
                    <Eye size={16} className="text-stone-400" />
                  )}
                </button>
              }
            />

            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-xs text-orange-500 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-orange-500 text-white py-3 rounded-xl"
            >
              Sign in
            </button>
          </form>

          {/* OR Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-stone-200"></div>
            <span className="text-sm text-stone-400">or</span>
            <div className="flex-1 h-px bg-stone-200"></div>
          </div>

          {/* Google Sign In */}
          <button className="w-full mt-6 border text-sm  border-stone-300 py-3 rounded-xl flex items-center justify-center gap-4 hover:bg-stone-50">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-5 h-5"
            />
            Sign in with Google
          </button>

          <p className="text-sm mt-6 text-center">
            Don't have an account?{" "}
            <Link to="/signup" className="text-orange-500 font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
