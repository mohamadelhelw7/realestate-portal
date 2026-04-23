import { redirect } from "react-router";
import type { Route } from "./+types/units.new";
import { Header } from "~/components/layout/Header";
import { Link } from "react-router";
import { SellerSection } from "~/components/layout/SellerSection";
import { TYPES, PURPOSES, STATUSES, CYCLES, FEATURES } from "~/lib/data/data";
import { num } from "~/lib/utils";
import Section from "~/components/layout/Section";
import Field from "~/components/layout/Field";
import { createUnit } from "~/lib/api/manage-units.server";
import { useState } from "react";
import { COMPOUNDS } from "~/lib/data/compounds";

export async function action({ request }: Route.ActionArgs) {
  const f = await request.formData();
  const g = (key: string) => f.get(key);

  const data = {
    title: g("title"),
    description: g("description") || undefined,
    price: Number(g("price")),
    downpayment: num(g("downpayment")),
    installments: num(g("installments")),
    cycle: num(g("cycle")),
    area: Number(g("area")),
    bedrooms: Number(g("bedrooms")),
    bathrooms: Number(g("bathrooms")),
    floor: num(g("floor")),
    totalFloors: num(g("totalFloors")),
    phase: g("phase"),
    city: g("city"),
    compound: g("compound") || undefined,
    type: g("type"),
    purpose: g("purpose"),
    status: g("status"),
    furnished: g("furnished") === "true",
    parking: g("parking") === "true",
    garden: g("garden") === "true",
    pool: g("pool") === "true",
    canAddPool: g("canAddPool") === "true",
    Hot: g("Hot") === "true",
    isReadyToMove: g("isReadyToMove") === "true",
    deliveryDate: g("deliveryDate") || undefined,
    gardenArea: num(g("gardenArea")),
    sellerName: g("sellerName"),
    sellerPhone: g("sellerPhone"),
    sellerEmail: g("sellerEmail") || undefined,
    sellerNotes: g("sellerNotes") || undefined,
  };

  const unit = await createUnit(data);

  return redirect(`/units/${unit.id}/images`);
}

const input = "border border-gray-300 px-3 py-2 text-sm"; // class name input

/* ─────────────────────────────────────────────────────────────────────── */

export default function AddUnitPage() {
  const [selectedCompound, setSelectedCompound] = useState<string>("");
  const phases =
    COMPOUNDS.find((c) => c.name === selectedCompound)?.phases ?? [];

  return (
    <div>
      <Header
        title="Add unit"
        action={
          <Link
            to="/units"
            className={`${input} text-gray-600 hover:bg-gray-50`}
          >
            Cancel
          </Link>
        }
      />

      <div className="p-6 max-w-3xl">
        <form method="post" className="flex flex-col gap-4">
          <Section title="Basic info">
            <Field label="Title" required>
              <input
                name="title"
                required
                className={`${input} w-full`}
                placeholder="e.g. Modern apartment in New Cairo"
              />
            </Field>
            <Field label="Description">
              <textarea
                name="description"
                rows={3}
                className={`${input} w-full resize-none`}
                placeholder="Describe the unit..."
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Purpose" required>
                <select name="purpose" required className={input}>
                  {PURPOSES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Type" required>
                <select name="type" required className={input}>
                  {TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Status" required>
                <select name="status" required className={input}>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Delivery date">
                <input name="deliveryDate" type="date" className={input} />
              </Field>
            </div>
          </Section>

          <Section title="Location">
            <div className="grid grid-cols-2 gap-3">
              <Field label="City" required>
                <input
                  name="city"
                  required
                  className={input}
                  placeholder="e.g. New Cairo"
                />
              </Field>

              <Field label="Compound">
                <select
                  name="compound"
                  className={input}
                  value={selectedCompound}
                  onChange={(e) => {
                    setSelectedCompound(e.target.value);
                  }}
                >
                  <option value="">Select Compound</option>
                  {COMPOUNDS.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Phase" required>
              <select
                name="phase"
                required
                className={input}
                disabled={!selectedCompound}
              >
                <option value="">Select Phase</option>
                {phases.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </Field>
          </Section>

          <Section title="Unit details">
            <div className="grid grid-cols-3 gap-3">
              <Field label="Area (m²)" required>
                <input
                  name="area"
                  type="number"
                  required
                  className={input}
                  placeholder="150"
                />
              </Field>
              <Field label="Bedrooms" required>
                <input
                  name="bedrooms"
                  type="number"
                  required
                  className={input}
                  placeholder="3"
                />
              </Field>
              <Field label="Bathrooms" required>
                <input
                  name="bathrooms"
                  type="number"
                  required
                  className={input}
                  placeholder="2"
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Floor">
                <input
                  name="floor"
                  type="number"
                  className={input}
                  placeholder="4"
                />
              </Field>
              <Field label="Total floors">
                <input
                  name="totalFloors"
                  type="number"
                  className={input}
                  placeholder="10"
                />
              </Field>
            </div>
          </Section>

          <Section title="Pricing">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Price (EGP)" required>
                <input
                  name="price"
                  type="number"
                  required
                  className={input}
                  placeholder="4500000"
                />
              </Field>
              <Field label="Down payment">
                <input
                  name="downpayment"
                  type="number"
                  className={input}
                  placeholder="500000"
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Installment">
                <input
                  name="installments"
                  type="number"
                  className={input}
                  placeholder="150000"
                />
              </Field>
              <Field label="Cycle (months)">
                <select name="cycle" className={input}>
                  <option value="">—</option>
                  {CYCLES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </Section>

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
                    className="w-4 h-4"
                  />
                  {f.label}
                </label>
              ))}
            </div>
          </div>

          <SellerSection />

          <div className="flex gap-3 justify-end">
            <Link
              to="/units"
              className={`${input} text-gray-600 hover:bg-gray-50`}
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
