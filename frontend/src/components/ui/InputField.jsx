export default function InputField({
  label,
  type = "text",
  placeholder,
  icon: Icon,
  error,
  rightEl,
  ...props
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-stone-700">
        {label}
      </label>

      <div className="flex items-center gap-3 bg-stone-50 border border-stone-200 rounded-xl px-4 py-3">
        {Icon && <Icon size={16} className="text-stone-400" />}

        <input
          type={type}
          placeholder={placeholder}
          {...props}
          className="bg-transparent outline-none text-sm w-full"
        />
        {rightEl}
      </div>

      {error && (
        <p className="text-red-500 text-xs ml-4">{error}</p>
      )}
    </div>
  );
}