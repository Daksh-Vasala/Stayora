import { useState } from "react";
import { Save, Check, Loader2 } from "lucide-react";

const inp =
  "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 bg-white transition-all";

function Toggle({ value, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`w-10 h-5 rounded-full relative transition-all border-none cursor-pointer ${value ? "bg-blue-600" : "bg-gray-200"}`}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${value ? "left-5.5" : "left-0.5"}`}
      />
    </button>
  );
}

function Row({ label, sub, children }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0 gap-4">
      <div className="min-w-0">
        <p className="text-[13.5px] font-semibold text-gray-800">{label}</p>
        {sub && <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export default function AdminSettings() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [platform, setPlatform] = useState({
    name: "Stayora",
    email: "support@stayora.com",
    fee: "10",
    currency: "INR",
  });

  const [toggles, setToggles] = useState({
    instantBook: true,
    emailNotifs: true,
    smsNotifs: false,
    autoPayouts: true,
    maintenanceMode: false,
    newListingApproval: true,
  });

  const setT = (k) => (v) => setToggles((p) => ({ ...p, [k]: v }));
  const setP = (k) => (e) =>
    setPlatform((p) => ({ ...p, [k]: e.target.value }));

  const save = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1200)); // TODO: axios.put('/api/admin/settings', { platform, toggles })
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-6 space-y-5 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Platform configuration and preferences
          </p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-xs font-bold px-4 py-2.5 rounded-xl border-none cursor-pointer transition-colors"
        >
          {saving ? (
            <Loader2 size={13} className="animate-spin" />
          ) : saved ? (
            <Check size={13} />
          ) : (
            <Save size={13} />
          )}
          {saving ? "Saving..." : saved ? "Saved!" : "Save changes"}
        </button>
      </div>

      {/* Platform info */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">
          Platform Info
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Platform name
            </label>
            <input
              className={inp}
              value={platform.name}
              onChange={setP("name")}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Support email
            </label>
            <input
              className={inp}
              type="email"
              value={platform.email}
              onChange={setP("email")}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Platform fee (%)
            </label>
            <input
              className={inp}
              type="number"
              min={0}
              max={100}
              value={platform.fee}
              onChange={setP("fee")}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Default currency
            </label>
            <select
              className={inp}
              value={platform.currency}
              onChange={setP("currency")}
            >
              {["INR", "USD", "EUR", "GBP"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Booking */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
          Booking
        </h3>
        <Row
          label="Instant Book"
          sub="Allow guests to book without host approval"
        >
          <Toggle value={toggles.instantBook} onChange={setT("instantBook")} />
        </Row>
        <Row
          label="New listing approval"
          sub="Require admin review before listing goes live"
        >
          <Toggle
            value={toggles.newListingApproval}
            onChange={setT("newListingApproval")}
          />
        </Row>
        <Row
          label="Auto payouts"
          sub="Release host payouts automatically after check-in"
        >
          <Toggle value={toggles.autoPayouts} onChange={setT("autoPayouts")} />
        </Row>
      </section>

      {/* Notifications */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
          Notifications
        </h3>
        <Row
          label="Email notifications"
          sub="Send booking and update emails to users"
        >
          <Toggle value={toggles.emailNotifs} onChange={setT("emailNotifs")} />
        </Row>
        <Row
          label="SMS notifications"
          sub="Send SMS alerts for bookings and disputes"
        >
          <Toggle value={toggles.smsNotifs} onChange={setT("smsNotifs")} />
        </Row>
      </section>

      {/* Danger */}
      <section className="bg-white rounded-2xl border border-red-100 shadow-sm p-5">
        <h3 className="text-xs font-bold text-red-400 uppercase tracking-wide mb-1">
          Danger Zone
        </h3>
        <Row
          label="Maintenance mode"
          sub="Take the platform offline for all users"
        >
          <Toggle
            value={toggles.maintenanceMode}
            onChange={setT("maintenanceMode")}
          />
        </Row>
      </section>
    </div>
  );
}
