import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Wifi,
  Car,
  Wind,
  Waves,
  Tv,
  UtensilsCrossed,
  Shield,
  Flame,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const TYPES = ["apartment", "house", "villa", "studio"];

const AMENITIES = [
  { id: "wifi", label: "Wi-Fi", Icon: Wifi },
  { id: "parking", label: "Parking", Icon: Car },
  { id: "ac", label: "AC", Icon: Wind },
  { id: "pool", label: "Pool", Icon: Waves },
  { id: "tv", label: "TV", Icon: Tv },
  { id: "kitchen", label: "Kitchen", Icon: UtensilsCrossed },
  { id: "security", label: "Security", Icon: Shield },
  { id: "heater", label: "Heater", Icon: Flame },
];

const input =
  "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition";

const card =
  "bg-white rounded-2xl p-6 shadow-md border border-gray-100 space-y-4";

export default function AddListingPage() {
  const navigate = useNavigate();

  const [imageFiles, setImageFiles] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      propertyType: "",
      maxGuests: 2,
      bedrooms: 1,
      beds: 1,
      bathrooms: 1,
      amenities: [],
    },
  });

  const propertyType = watch("propertyType");
  const amenities = watch("amenities");

  const onSubmit = async (formData) => {
    try {
      if (imageFiles.length === 0) {
        alert("At least 1 image required");
        return;
      }

      const fd = new FormData();

      fd.append("title", formData.title);
      fd.append("description", formData.description);
      fd.append("pricePerNight", formData.pricePerNight);
      fd.append("propertyType", formData.propertyType);
      fd.append("maxGuests", formData.maxGuests);
      fd.append("bedrooms", formData.bedrooms);
      fd.append("bathrooms", formData.bathrooms);
      fd.append("beds", formData.beds);

      fd.append("location", JSON.stringify(formData.location));

      formData.amenities.forEach((item) => {
        fd.append("amenities", item);
      });

      // ✅ Correct way
      imageFiles.forEach((file) => {
        fd.append("images", file);
      });

      await axios.post("/property", fd);

      navigate("/host/listings");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen py-10 bg-gray-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-2xl mx-auto px-4 space-y-6"
      >
        {/* PROPERTY TYPE */}
        <div className={card}>
          <h3 className="text-sm font-bold">Property type *</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {TYPES.map((t) => (
              <label key={t}>
                <input
                  type="radio"
                  value={t}
                  {...register("propertyType", {
                    required: "Select property type",
                  })}
                  className="hidden"
                />
                <div
                  className={`py-2 text-center rounded-xl border text-sm capitalize cursor-pointer
                  ${
                    propertyType === t
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-200 text-gray-500"
                  }`}
                >
                  {t}
                </div>
              </label>
            ))}
          </div>
          {errors.propertyType && (
            <p className="text-xs text-red-500">
              {errors.propertyType.message}
            </p>
          )}
        </div>

        {/* BASIC INFO */}
        <div className={card}>
          <h3 className="text-sm font-bold">Basic info</h3>

          <input
            {...register("title", { required: "Title required" })}
            placeholder="Title"
            className={input}
          />

          <input
            {...register("description")}
            placeholder="Description"
            className={input}
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              {...register("location.city", { required: "City required" })}
              placeholder="City"
              className={input}
            />
            <input
              {...register("location.country", {
                required: "Country required",
              })}
              placeholder="Country"
              className={input}
            />
            <input
              {...register("location.address", {
                required: "Address required",
              })}
              placeholder="Address"
              className={`${input} col-span-2`}
            />
          </div>
        </div>

        {/* DETAILS */}
        <div className={card}>
          <h3 className="text-sm font-bold">Details</h3>

          <input
            type="number"
            placeholder="Price per night"
            {...register("pricePerNight", {
              required: "Price required",
              min: { value: 1, message: "Must be greater than 0" },
            })}
            className={input}
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <input type="number" {...register("maxGuests")} className={input} placeholder="Guests" />
            <input type="number" {...register("bedrooms")} className={input} placeholder="Bedrooms" />
            <input type="number" {...register("beds")} className={input} placeholder="Beds" />
            <input type="number" {...register("bathrooms")} className={input} placeholder="Bathrooms" />
          </div>
        </div>

        {/* AMENITIES */}
        <div className={card}>
          <h3 className="text-sm font-bold">Amenities</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {AMENITIES.map(({ id, label, Icon }) => (
              <label
                key={id}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm cursor-pointer
                ${
                  amenities?.includes(id)
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-200 text-gray-500"
                }`}
              >
                <input
                  type="checkbox"
                  value={id}
                  {...register("amenities")}
                  className="hidden"
                />
                <Icon size={14} />
                {label}
              </label>
            ))}
          </div>
        </div>

        {/* IMAGES */}
        <div className={card}>
          <h3 className="text-sm font-bold">Images *</h3>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => {
              const files = Array.from(e.target.files);

              if (imageFiles.length + files.length > 6) {
                alert("Max 6 images allowed");
                return;
              }

              setImageFiles((prev) => [...prev, ...files]);
            }}
          />

          <div className="grid grid-cols-3 gap-3 mt-4">
            {imageFiles.map((file, i) => (
              <div key={i} className="relative group">
                <img
                  src={URL.createObjectURL(file)}
                  className="h-24 w-full object-cover rounded-xl"
                />

                <button
                  type="button"
                  onClick={() =>
                    setImageFiles((prev) =>
                      prev.filter((_, index) => index !== i)
                    )
                  }
                  className="absolute top-1 right-1 bg-red-500 text-white w-5 h-5 rounded-full text-xs opacity-0 group-hover:opacity-100"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 rounded-2xl bg-blue-600 text-white font-bold flex justify-center items-center"
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : "Publish"}
        </button>
      </form>
    </div>
  );
}