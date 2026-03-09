import { Mail, Lock, User, Phone, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

import Logo from "../components/Logo";
import InputField from "../components/InputField";
import LeftPanel from "../components/LeftPanel";
import { useState } from "react";

export default function Signup() {
  const [role, setRole] = useState("guest");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-stone-50 p-4">
      <div className="grid lg:grid-cols-2 bg-white rounded-3xl shadow-xl max-w-4xl w-full overflow-hidden">
        <LeftPanel />

        <div className="p-10">
          <Logo />

          <h1 className="text-2xl font-bold mt-6">Create account</h1>

          {/* Role selector */}
          <div className="mb-5">
            <p className="text-sm font-semibold text-stone-700 mb-2">
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
                    ? "border-orange-500 bg-orange-50"
                    : "border-stone-200 bg-white hover:border-stone-300"
                }`}
                >
                  <span
                    className={`text-sm font-bold ${role === id ? "text-orange-500" : "text-stone-800"}`}
                  >
                    {label}
                  </span>
                  <span className="text-xs text-stone-500 mt-0.5">{sub}</span>
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
                    <EyeOff size={16} className="text-stone-400" />
                  ) : (
                    <Eye size={16} className="text-stone-400" />
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
              className="w-full mt-4 bg-orange-500 text-white py-3 rounded-xl"
            >
              Sign up
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
            Already have an account?{" "}
            <Link to="/" className="text-orange-500 font-semibold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
