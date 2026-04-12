import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  Save,
  Loader2,
  Plus,
  Minus,
  X,
  Upload,
  Check,
  Wifi,
  Car,
  Waves,
  Wind,
  Tv,
  UtensilsCrossed,
  Shield,
  Flame,
} from "lucide-react";

const TYPES = ["apartment", "villa", "house", "studio"];
const AMENITIES = [
  { id: "wifi", label: "Wi-Fi", Icon: Wifi },
  { id: "parking", label: "Parking", Icon: Car },
  { id: "pool", label: "Pool", Icon: Waves },
  { id: "ac", label: "AC", Icon: Wind },
  { id: "kitchen", label: "Kitchen", Icon: UtensilsCrossed },
  { id: "tv", label: "TV", Icon: Tv },
  { id: "heater", label: "Heater", Icon: Flame },
  { id: "security", label: "Security", Icon: Shield },
];

const inp =
  "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 placeholder:text-gray-300 transition-all bg-white";

const Field = ({ label, error, children }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
      {label}
    </label>
    {children}
    {error && <p className="text-[11px] text-red-500 mt-1">{error}</p>}
  </div>
);

export default function UpdateListingPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  register("status");
  const form = watch();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [existingImgs, setExistingImgs] = useState([]);
  const [newImgs, setNewImgs] = useState([]);
  const [deletedImgs, setDeletedImgs] = useState([]);
  const fileRef = useRef(null);

  useEffect(() => {
    axios
      .get(`/property/${id}`)
      .then(({ data }) => {
        const p = data.data;
        Object.entries({
          title: p.title || "",
          description: p.description || "",
          propertyType: p.propertyType || "",
          pricePerNight: p.pricePerNight || "",
          city: p.location?.city || "",
          country: p.location?.country || "",
          address: p.location?.address || "",
          maxGuests: p.maxGuests || 1,
          bedrooms: p.bedrooms || 1,
          beds: p.beds || 1,
          bathrooms: p.bathrooms || 1,
          amenities: p.amenities || [],
          status: p.status || "active",
        }).forEach(([k, v]) => setValue(k, v));

        setExistingImgs(p.images || []);
      })
      .catch(() => navigate("/host/listings"))
      .finally(() => setLoading(false));
  }, [id]);

  const setNum = (k, delta) => setValue(k, Math.max(1, (form[k] || 1) + delta));

  const toggleAmenity = (id) => {
    const arr = form.amenities || [];
    setValue(
      "amenities",
      arr.includes(id) ? arr.filter((a) => a !== id) : [...arr, id],
    );
  };

  const removeExisting = (publicId) => {
    setExistingImgs((prev) => prev.filter((img) => img.public_id !== publicId));
    setDeletedImgs((prev) => [...prev, publicId]); // 🔥 track deletion
  };
  const removeNew = (id) => setNewImgs((p) => p.filter((i) => i.id !== id));

  const addFiles = (files) => {
    const valid = [...files].filter((f) => f.type.startsWith("image/"));
    const slots = 10 - (existingImgs.length + newImgs.length);
    setNewImgs((prev) => [
      ...prev,
      ...valid.slice(0, slots).map((f) => ({
        id: Math.random().toString(36),
        url: URL.createObjectURL(f),
        file: f,
      })),
    ]);
  };

  const onSubmit = async (data) => {
    if (existingImgs.length + newImgs.length < 1) return;

    setSaving(true);

    try {
      const formData = new FormData();

      // 🔹 normal fields
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // 🔹 location object
      formData.append(
        "location",
        JSON.stringify({
          city: data.city,
          country: data.country,
          address: data.address,
        }),
      );

      // 🔹 existing + deleted tracking
      formData.append("existingImages", JSON.stringify(existingImgs));
      formData.append("deletedImages", JSON.stringify(deletedImgs));

      // 🔹 new images (IMPORTANT for multer)
      newImgs.forEach((img) => {
        formData.append("images", img.file);
      });

      await axios.put(`/property/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );

  const totalImgs = existingImgs.length + newImgs.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <form
        id="update-form"
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-3xl mx-auto px-4 sm:px-6 py-7 space-y-5"
      >
        {/* Property Type */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
            Property Type
          </label>
          <div className="grid grid-cols-4 gap-2">
            {TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setValue("propertyType", t)}
                className={`py-2 rounded-xl text-xs font-semibold border-2 capitalize transition-all cursor-pointer
                  ${
                    form.propertyType === t
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-100 text-gray-500 hover:border-gray-300 bg-white"
                  }`}
              >
                {t}
              </button>
            ))}
          </div>
        </section>

        {/* Basic Info */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">
            Basic Info
          </label>

          <Field label="Title *" error={errors.title?.message}>
            <input
              {...register("title", { required: "Required" })}
              className={inp}
            />
          </Field>

          <Field label="Description">
            <textarea
              {...register("description")}
              className={inp + " resize-none"}
              rows={3}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="City *" error={errors.city?.message}>
              <input
                {...register("city", { required: "Required" })}
                className={inp}
              />
            </Field>
            <Field label="Country">
              <input {...register("country")} className={inp} />
            </Field>
          </div>

          <Field label="Address *" error={errors.address?.message}>
            <input
              {...register("address", { required: "Required" })}
              className={inp}
            />
          </Field>
        </section>

        {/* Capacity */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">
            Capacity & Rooms
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {["maxGuests", "bedrooms", "beds", "bathrooms"].map((k) => (
              <div
                key={k}
                className="flex flex-col items-center gap-2 bg-gray-50 rounded-xl py-3.5"
              >
                <span className="text-[11px] font-semibold text-gray-500">
                  {k}
                </span>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setNum(k, -1)}
                    className="w-6 h-6 rounded-full border border-gray-200"
                  >
                    <Minus size={10} />
                  </button>
                  <span className="text-sm font-bold text-gray-900 w-4 text-center">
                    {form[k]}
                  </span>
                  <button
                    type="button"
                    onClick={() => setNum(k, 1)}
                    className="w-6 h-6 rounded-full border border-gray-200"
                  >
                    <Plus size={10} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Amenities */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
            Amenities
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {AMENITIES.map((a) => {
              const on = form.amenities?.includes(a.id);
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => toggleAmenity(a.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-xs font-semibold
                    ${on ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-100 text-gray-500 hover:border-gray-300 bg-white"}`}
                >
                  <a.Icon size={13} />
                  {a.label}
                  {on && <Check size={10} className="ml-auto text-blue-600" />}
                </button>
              );
            })}
          </div>
        </section>

        {/* Images */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">
              Photos
            </label>
            <span className="text-[11px] text-gray-400">{totalImgs} / 10</span>
          </div>

          {totalImgs > 0 && (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-3">
              {existingImgs.map((img, i) => (
                <div
                  key={img.public_id || i}
                  className="relative aspect-square rounded-xl overflow-hidden group bg-gray-100"
                >
                  <img src={img.url} className="w-full h-full object-cover" />
                  {i === 0 && (
                    <span className="absolute bottom-1 left-1 text-[8px] font-bold bg-blue-600 text-white px-1.5 py-0.5 rounded">
                      Cover
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeExisting(img.public_id)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100"
                  >
                    <X size={9} className="text-white" />
                  </button>
                </div>
              ))}

              {newImgs.map((img) => (
                <div
                  key={img.id}
                  className="relative aspect-square rounded-xl overflow-hidden group bg-gray-100"
                >
                  <img src={img.url} className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 left-1 text-[8px] font-bold bg-amber-500 text-white px-1.5 py-0.5 rounded">
                    New
                  </span>
                  <button
                    type="button"
                    onClick={() => removeNew(img.id)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100"
                  >
                    <X size={9} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {totalImgs < 10 && (
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-gray-200 hover:border-blue-300 rounded-2xl p-5 text-center cursor-pointer"
            >
              <input
                ref={fileRef}
                type="file"
                multiple
                accept="image/*"
                hidden
                onChange={(e) => addFiles(e.target.files)}
              />
              <Upload size={18} className="mx-auto mb-1.5" />
              <p className="text-xs">Add photos</p>
            </div>
          )}
        </section>

        {/* Pricing */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <Field
            label="Price per night (₹) *"
            error={errors.pricePerNight?.message}
          >
            <input
              type="number"
              {...register("pricePerNight", { required: "Required" })}
              className={inp}
            />
          </Field>
        </section>

        {/* Status */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
            Status
          </label>

          <div className="flex gap-2">
            {["active", "inactive"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setValue("status", s)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-semibold capitalize border-2 transition-all cursor-pointer
                  ${
                    form.status === s
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-100 text-gray-500 hover:border-gray-300 bg-white"
                  }`}
              >
                {s}
              </button>
            ))}
          </div>
        </section>

        {/* Bottom Save Button */}
        <div className="pb-4">
          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold text-sm"
          >
            {saving ? (
              <Loader2 size={15} className="animate-spin" />
            ) : saved ? (
              <Check size={15} />
            ) : (
              <Save size={15} />
            )}
            {saving ? "Saving..." : saved ? "Saved!" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
