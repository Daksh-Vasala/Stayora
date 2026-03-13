import { Home } from "lucide-react";
import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <Home size={22} className="text-blue-500" />
      <span className="text-xl font-bold text-stone-900">
        Stay<span className="text-blue-500">ora</span>
      </span>
    </Link>
  );
}