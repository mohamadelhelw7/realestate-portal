import { redirect } from "react-router";
import type { Route } from "./+types/units.new";
import { Header } from "~/components/layout/Header";
import { Link } from "react-router";

const TYPES = [
  "apartment",
  "villa",
  "studio",
  "duplex",
  "penthouse",
  "office",
  "retail",
];
const PURPOSES = ["sale", "rent"];
const STATUSES = ["available", "sold", "rented"];
const CYCLES = ["3", "6", "12"];

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const data = {
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    price: Number(formData.get("price")),
    downpayment: formData.get("downpayment")
      ? Number(formData.get("downpayment"))
      : undefined,
    installments: formData.get("installments")
      ? Number(formData.get("installments"))
      : undefined,
    cycle: formData.get("cycle") ? Number(formData.get("cycle")) : undefined,
    area: Number(formData.get("area")),
    bedrooms: Number(formData.get("bedrooms")),
    bathrooms: Number(formData.get("bathrooms")),
    floor: formData.get("floor") ? Number(formData.get("floor")) : undefined,
    totalFloors: formData.get("totalFloors")
      ? Number(formData.get("totalFloors"))
      : undefined,
    phase: formData.get("phase"),
    city: formData.get("city"),
    compound: formData.get("compound") || undefined,
    type: formData.get("type"),
    purpose: formData.get("purpose"),
    status: formData.get("status"),
    furnished: formData.get("furnished") === "true",
    parking: formData.get("parking") === "true",
    garden: formData.get("garden") === "true",
    pool: formData.get("pool") === "true",
    canAddPool: formData.get("canAddPool") === "true",
    Hot: formData.get("Hot") === "true",
    isReadyToMove: formData.get("isReadyToMove") === "true",
    deliveryDate: formData.get("deliveryDate") || undefined,
    gardenArea: formData.get("gardenArea")
      ? Number(formData.get("gardenArea"))
      : undefined,
  };

  const res = await fetch(`${process.env.API_URL}/portal/units`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.PORTAL_API_KEY!,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to create unit");

  const unit = await res.json();
  return redirect(`/units/${unit.id}`);
}

export default function AddUnitPage() {
  return (
    <div>
      <Header
        title="Add unit"
        action={
          <Link
            to="/units"
            className="text-sm text-gray-600 border border-gray-300 px-4 py-2 hover:bg-gray-50"
          >
            Cancel
          </Link>
        }
      />

      <div className="p-6 max-w-3xl">
        <form method="post" className="flex flex-col gap-4">
          <div className="border border-gray-300 bg-white">
            <div className="px-4 py-2.5 bg-gray-100 border-b border-gray-300 text-sm font-medium text-gray-700">
              Basic info
            </div>
            <div className="p-4 flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-600">Title *</label>
                <input
                  name="title"
                  required
                  className="border border-gray-300 px-3 py-2 text-sm w-full"
                  placeholder="e.g. Modern apartment in New Cairo"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-600">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  className="border border-gray-300 px-3 py-2 text-sm w-full resize-none"
                  placeholder="Describe the unit..."
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-600">Purpose *</label>
                  <select
                    name="purpose"
                    required
                    className="border border-gray-300 px-3 py-2 text-sm"
                  >
                    {PURPOSES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-600">Type *</label>
                  <select
                    name="type"
                    required
                    className="border border-gray-300 px-3 py-2 text-sm"
                  >
                    {TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-600">Status *</label>
                  <select
                    name="status"
                    required
                    className="border border-gray-300 px-3 py-2 text-sm"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-600">Delivery date</label>
                  <input
                    name="deliveryDate"
                    type="date"
                    className="border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border border-gray-300 bg-white">
            <div className="px-4 py-2.5 bg-gray-100 border-b border-gray-300 text-sm font-medium text-gray-700">
              Location
            </div>
            <div className="p-4 flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-600">City *</label>
                  <input
                    name="city"
                    required
                    className="border border-gray-300 px-3 py-2 text-sm"
                    placeholder="e.g. New Cairo"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-600">Phase *</label>
                  <input
                    name="phase"
                    required
                    className="border border-gray-300 px-3 py-2 text-sm"
                    placeholder="e.g. Phase 3"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-600">Compound</label>
                <input
                  name="compound"
                  className="border border-gray-300 px-3 py-2 text-sm"
                  placeholder="e.g. Hyde Park"
                />
              </div>
            </div>
          </div>

          <div className="border border-gray-300 bg-white">
            <div className="px-4 py-2.5 bg-gray-100 border-b border-gray-300 text-sm font-medium text-gray-700">
              Unit details
            </div>
            <div className="p-4 flex flex-col gap-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-600">Area (m²) *</label>
                  <input
                    name="area"
                    type="number"
                    required
                    className="border border-gray-300 px-3 py-2 text-sm"
                    placeholder="150"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-600">Bedrooms *</label>
                  <input
                    name="bedrooms"
                    type="number"
                    required
                    className="border border-gray-300 px-3 py-2 text-sm"
                    placeholder="3"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-600">Bathrooms *</label>
                  <input
                    name="bathrooms"
                    type="number"
                    required
                    className="border border-gray-300 px-3 py-2 text-sm"
                    placeholder="2"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-600">Floor</label>
                  <input
                    name="floor"
                    type="number"
                    className="border border-gray-300 px-3 py-2 text-sm"
                    placeholder="4"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-600">Total floors</label>
                  <input
                    name="totalFloors"
                    type="number"
                    className="border border-gray-300 px-3 py-2 text-sm"
                    placeholder="10"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border border-gray-300 bg-white">
            <div className="px-4 py-2.5 bg-gray-100 border-b border-gray-300 text-sm font-medium text-gray-700">
              Pricing
            </div>
            <div className="p-4 flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-600">Price (EGP) *</label>
                  <input
                    name="price"
                    type="number"
                    required
                    className="border border-gray-300 px-3 py-2 text-sm"
                    placeholder="4500000"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-600">Down payment</label>
                  <input
                    name="downpayment"
                    type="number"
                    className="border border-gray-300 px-3 py-2 text-sm"
                    placeholder="500000"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-600">Installment</label>
                  <input
                    name="installments"
                    type="number"
                    className="border border-gray-300 px-3 py-2 text-sm"
                    placeholder="150000"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-600">
                    Cycle (months)
                  </label>
                  <select
                    name="cycle"
                    className="border border-gray-300 px-3 py-2 text-sm"
                  >
                    <option value="">—</option>
                    {CYCLES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-gray-300 bg-white">
            <div className="px-4 py-2.5 bg-gray-100 border-b border-gray-300 text-sm font-medium text-gray-700">
              Features
            </div>
            <div className="p-4">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { name: "furnished", label: "Furnished" },
                  { name: "parking", label: "Parking" },
                  { name: "pool", label: "Pool" },
                  { name: "garden", label: "Garden" },
                  { name: "canAddPool", label: "Can add pool" },
                  { name: "Hot", label: "Hot" },
                  { name: "isReadyToMove", label: "Ready to move" },
                ].map((f) => (
                  <label
                    key={f.name}
                    className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      name={f.name}
                      value="true"
                      className="w-4 h-4"
                    />
                    {f.label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Link
              to="/units"
              className="text-sm text-gray-600 border border-gray-300 px-4 py-2 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="bg-gray-900 text-white text-sm px-6 py-2 hover:bg-gray-700"
            >
              Save unit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
