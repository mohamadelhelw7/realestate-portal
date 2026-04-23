import { redirect } from "react-router";
import { useState } from "react";
import type { Route } from "./+types/units.$id.edit";
import { Header } from "~/components/layout/Header";
import { Link } from "react-router";
import { TYPES, PURPOSES, STATUSES, CYCLES, FEATURES } from "~/lib/data/data";
import { COMPOUNDS } from "~/lib/data/compounds";
import {
  deleteUnit,
  getUnitDetails,
  updateUnit,
} from "~/lib/api/manage-units.server";

export async function loader({ params }: Route.LoaderArgs) {
  const { id } = params as { id: string };

  const unit = await getUnitDetails(id);
  if (!unit) throw new Response("Not found", { status: 404 });

  return { unit };
}

export async function action({ request, params }: Route.ActionArgs) {
  const { id } = params as { id: string };
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "delete") {
    await deleteUnit(id);
    return redirect("/units");
  }

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

  await updateUnit(id, data);
  return redirect("/units");
}

const input = "border border-gray-300 px-3 py-2 text-sm";

export default function EditUnitPage({ loaderData }: Route.ComponentProps) {
  const { unit } = loaderData;

  const [selectedCompound, setSelectedCompound] = useState<string>(
    unit.compound ?? "",
  );
  const phases =
    COMPOUNDS.find((c) => c.name === selectedCompound)?.phases ?? [];

  return (
    <div>
      <Header
        title={`Edit — ${unit.title}`}
        action={
          <Link
            to="/units"
            className={`text-sm text-gray-600 ${input} hover:bg-gray-50`}
          >
            Cancel
          </Link>
        }
      />

      <div className="p-6 max-w-3xl">
        <form method="post" className="flex flex-col gap-4">
          {/* Basic info */}
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
                  defaultValue={unit.title}
                  className={`${input} w-full`}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-600">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={unit.description ?? ""}
                  className={`${input} w-full resize-none`}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-600">Purpose *</label>
                  <select
                    name="purpose"
                    required
                    defaultValue={unit.purpose}
                    className={input}
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
                    defaultValue={unit.type}
                    className={input}
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
                    defaultValue={unit.status}
                    className={input}
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
                    defaultValue={
                      unit.deliveryDate ? unit.deliveryDate.split("T")[0] : ""
                    }
                    className={input}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
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
                    defaultValue={unit.city}
                    className={input}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-600">Compound</label>
                  <select
                    name="compound"
                    className={input}
                    value={selectedCompound}
                    onChange={(e) => setSelectedCompound(e.target.value)}
                  >
                    <option value="">— Select compound</option>
                    {COMPOUNDS.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-600">Phase *</label>
                <select
                  name="phase"
                  required
                  className={input}
                  disabled={!selectedCompound}
                  defaultValue={unit.phase}
                >
                  <option value="">— Select phase</option>
                  {phases.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Unit details */}
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
                    defaultValue={unit.area}
                    className={input}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-600">Bedrooms *</label>
                  <input
                    name="bedrooms"
                    type="number"
                    required
                    defaultValue={unit.bedrooms}
                    className={input}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-600">Bathrooms *</label>
                  <input
                    name="bathrooms"
                    type="number"
                    required
                    defaultValue={unit.bathrooms}
                    className={input}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-600">Floor</label>
                  <input
                    name="floor"
                    type="number"
                    defaultValue={unit.floor ?? ""}
                    className={input}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-600">Total floors</label>
                  <input
                    name="totalFloors"
                    type="number"
                    defaultValue={unit.totalFloors ?? ""}
                    className={input}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
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
                    defaultValue={unit.price}
                    className={input}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-600">Down payment</label>
                  <input
                    name="downpayment"
                    type="number"
                    defaultValue={unit.downpayment ?? ""}
                    className={input}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-600">Installment</label>
                  <input
                    name="installments"
                    type="number"
                    defaultValue={unit.installments ?? ""}
                    className={input}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-600">
                    Cycle (months)
                  </label>
                  <select
                    name="cycle"
                    defaultValue={unit.cycle ?? ""}
                    className={input}
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

          {/* Features */}
          <div className="border border-gray-300 bg-white">
            <div className="px-4 py-2.5 bg-gray-100 border-b border-gray-300 text-sm font-medium text-gray-700">
              Features
            </div>
            <div className="p-4 grid grid-cols-3 gap-2">
              {FEATURES.map((f) => (
                <label
                  key={f.name}
                  className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    name={f.name}
                    value="true"
                    defaultChecked={unit[f.name as keyof typeof unit] === true}
                    className="w-4 h-4"
                  />
                  {f.label}
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center mt-2">
            <form method="post">
              <input type="hidden" name="intent" value="delete" />
              <button
                type="submit"
                onClick={(e) => {
                  if (
                    !confirm(
                      "Are you sure you want to delete this unit? This cannot be undone.",
                    )
                  )
                    e.preventDefault();
                }}
                className="text-sm text-red-600 border border-red-300 px-4 py-2 hover:bg-red-50"
              >
                Delete unit
              </button>
            </form>
            <div className="flex gap-3">
              <Link
                to={`/units/${unit.id}/images`}
                className={`text-sm text-gray-600 ${input} hover:bg-gray-50`}
              >
                Manage images
              </Link>
              <Link
                to="/units"
                className={`text-sm text-gray-600 ${input} hover:bg-gray-50`}
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="bg-gray-900 text-white text-sm px-6 py-2 hover:bg-gray-700"
              >
                Save changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
