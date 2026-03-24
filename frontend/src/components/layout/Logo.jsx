import { Home } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Home size={22} className="text-blue-500" />
      <span className="text-xl font-bold text-stone-900">
        Stay<span className="text-blue-500">ora</span>
      </span>
    </div>
  );
}