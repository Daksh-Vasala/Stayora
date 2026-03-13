import { Home, CheckCircle2 } from "lucide-react";

export default function LeftPanel() {
  return (
    <div className="hidden lg:flex flex-col justify-between bg-[#0F1D1A] p-10 text-white">
      
      <div className="flex items-center gap-2">
        <Home className="text-emerald-400" />
        <span className="font-bold text-xl">
          Stay<span className="text-emerald-400">ora</span>
        </span>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-bold">
          Your perfect stay <br />
          <span className="text-emerald-400">starts here.</span>
        </h2>

        <ul className="space-y-2 text-sm text-gray-300">
          <li className="flex gap-2">
            <CheckCircle2 size={16} /> Secure bookings
          </li>
          <li className="flex gap-2">
            <CheckCircle2 size={16} /> Verified hosts
          </li>
          <li className="flex gap-2">
            <CheckCircle2 size={16} /> 24/7 support
          </li>
        </ul>
      </div>

      <p className="text-xs text-gray-400">
        © 2025 Stayora
      </p>

    </div>
  );
}