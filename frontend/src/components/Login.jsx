import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onTouched",
  });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("https://node5.onrender.com/user/login",data)
      console.log(res);
      if(res.status==200){
        toast.success("Logged in successfully");
        navigate("/user")
      }
    } catch (error) {
      console.error(error);
      toast.error("Logged in failed");
    }
  };

  const validators = {
    email: {
      required: "Email is required",
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Enter a valid email address",
      },
      setValueAs: (v) => v.trim(),
    },
    password: {
      required: "Password is required",
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-100 to-blue-300 px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8">
        {/* Logo */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600">Stayora</h1>
          <p className="text-gray-500 mt-2 text-sm">Find your perfect stay</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              {...register("email", validators.email)}
              className={`mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                errors.email
                  ? "border-red-500 focus:ring-red-400"
                  : "focus:ring-blue-400"
              }`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              {...register("password", validators.password)}
              className={`mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                errors.password
                  ? "border-red-500 focus:ring-red-400"
                  : "focus:ring-blue-400"
              }`}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="accent-blue-600" />
              <span className="text-gray-600">Remember me</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-blue-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300 font-medium disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="grow h-px bg-gray-300"></div>
          <span className="mx-4 text-gray-400 text-sm">OR</span>
          <div className="grow h-px bg-gray-300"></div>
        </div>

        {/* Google Login */}
        <button className="w-full border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition">
          Continue with Google
        </button>

        {/* Register */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
