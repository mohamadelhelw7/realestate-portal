import { useState, type ReactNode } from "react";
import { Link } from "react-router";
import { TYPES, PURPOSES, STATUSES, CYCLES } from "~/lib/data/data";
import { COMPOUNDS } from "~/lib/data/compounds";
import Section from "~/components/layout/Section";
import Field from "~/components/layout/Field";
import { MoneyInput } from "../layout/MoneyInput";
import { formatDuration } from "~/lib/format";

const inputCls = "border border-gray-300 px-3 py-2 text-sm";

export interface UnitFormValues {
  maintenance?: number | null;
  paymentMonths?: number | null;
  paymentNotes?: string;
  finishing?: string;
  title?: string;
  description?: string;
  price?: number;
  downpayment?: number | null;
  installments?: number | null;
  commission?: number | null;
  cycle?: number | null;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  floor?: number | null;
  totalFloors?: number | null;
  phase?: string;
  city?: string;
  compound?: string | null;
  type?: string;
  purpose?: string;
  status?: string;
  furnished?: boolean;
  parking?: boolean;
  garden?: boolean;
  gardenArea?: number | null;
  roof?: boolean;
  roofArea?: number | null;
  pool?: boolean;
  canAddPool?: boolean;
  Hot?: boolean;
  isReadyToMove?: boolean;
  deliveryDate?: string;
}

interface Props {
  initialValues?: UnitFormValues;
  error?: string;
  submitLabel: string;
  /** Extra sections rendered before the footer (e.g. SellerSection on the new page) */
  extraSections?: ReactNode;
  /** Left side of the footer (e.g. delete button on edit) */
  footerLeft?: ReactNode;
  /** Extra buttons before submit (e.g. "Manage images" on edit) */
  footerExtras?: ReactNode;
  cancelHref?: string;
}

/** Small toggle row — checkbox label, optional conditional content below */
function ToggleRow({
  name,
  label,
  defaultChecked,
  checked,
  onChange,
  children,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  children?: ReactNode;
}) {
  const isControlled = checked !== undefined;
  return (
    <div className="border border-gray-200 bg-white">
      <label className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 cursor-pointer">
        <input
          type="checkbox"
          name={name}
          value="true"
          {...(isControlled
            ? { checked, onChange: (e) => onChange?.(e.target.checked) }
            : { defaultChecked })}
          className="w-4 h-4"
        />
        {label}
      </label>
      {children && (
        <div className="border-t border-gray-200 px-3 py-2 bg-gray-50">
          {children}
        </div>
      )}
    </div>
  );
}

export function UnitForm({
  initialValues = {},
  error,
  submitLabel,
  extraSections,
  footerLeft,
  footerExtras,
  cancelHref = "/units",
}: Props) {
  const v = {
    purpose: "sale",
    status: "available",
    ...initialValues,
  };
  const [selectedCompound, setSelectedCompound] = useState<string>(
    v.compound ?? "",
  );
  const phases =
    COMPOUNDS.find((c) => c.name === selectedCompound)?.phases ?? [];

  // Controlled state only for amenities that gate other fields
  const [hasGarden, setHasGarden] = useState(v.garden ?? false);
  const [hasRoof, setHasRoof] = useState(v.roof ?? false);
  const [readyToMove, setReadyToMove] = useState(v.isReadyToMove ?? false);

  return (
    <div className="p-6 max-w-3xl">
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-300 text-sm text-red-700">
          {error}
        </div>
      )}

      <form method="post" className="flex flex-col gap-4">
        <Section title="Basic info">
          <Field label="Title" required>
            <input
              name="title"
              required
              defaultValue={v.title ?? ""}
              className={`${inputCls} w-full`}
              placeholder="e.g. Modern apartment in New Cairo"
            />
          </Field>
          <Field label="Description">
            <textarea
              name="description"
              rows={3}
              defaultValue={v.description ?? ""}
              className={`${inputCls} w-full resize-none`}
              placeholder="Describe the unit..."
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Purpose" required>
              <select
                name="purpose"
                required
                defaultValue={v.purpose ?? ""}
                className={inputCls}
              >
                {!v.purpose && <option value="">Select purpose</option>}
                {PURPOSES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Type" required>
              <select
                name="type"
                required
                defaultValue={v.type ?? ""}
                className={inputCls}
              >
                {!v.type && <option value="">Select type</option>}
                {TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </Section>

        <Section title="Location">
          <div className="grid grid-cols-2 gap-3">
            <Field label="City" required>
              <input
                name="city"
                required
                defaultValue={v.city ?? ""}
                className={inputCls}
                placeholder="e.g. New Cairo"
              />
            </Field>
            <Field label="Compound">
              <select
                name="compound"
                className={inputCls}
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
            </Field>
          </div>
          <Field label="Phase" required>
            <select
              name="phase"
              required
              className={inputCls}
              disabled={!selectedCompound}
              defaultValue={v.phase ?? ""}
            >
              <option value="">
                {selectedCompound
                  ? "— Select phase"
                  : "Select a compound first"}
              </option>
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
                min="1"
                required
                defaultValue={v.area ?? ""}
                className={inputCls}
                placeholder="150"
              />
            </Field>
            <Field label="Bedrooms" required>
              <input
                name="bedrooms"
                type="number"
                min="0"
                required
                defaultValue={v.bedrooms ?? ""}
                className={inputCls}
                placeholder="3"
              />
            </Field>
            <Field label="Bathrooms" required>
              <input
                name="bathrooms"
                type="number"
                min="0"
                required
                defaultValue={v.bathrooms ?? ""}
                className={inputCls}
                placeholder="2"
              />
            </Field>
          </div>
          <Field label="Floor">
            <input
              name="floor"
              type="number"
              defaultValue={v.floor ?? ""}
              className={inputCls}
              placeholder="4"
            />
          </Field>
          <Field label="Finishing">
            <select
              name="finishing"
              defaultValue={v.finishing ?? ""}
              className={inputCls}
            >
              <option value="">— Select finishing</option>
              <option value="core_and_shell">Core & shell</option>
              <option value="semi_finished">Semi-finished</option>
              <option value="fully_finished">Fully finished</option>
            </select>
          </Field>
        </Section>

        <Section title="Amenities">
          <div className="grid grid-cols-2 gap-2">
            <ToggleRow
              name="garden"
              label="Garden"
              checked={hasGarden}
              onChange={setHasGarden}
            >
              {hasGarden && (
                <Field label="Garden area (m²)">
                  <input
                    name="gardenArea"
                    type="number"
                    min="1"
                    defaultValue={v.gardenArea ?? ""}
                    className={`${inputCls} w-full`}
                    placeholder="50"
                  />
                </Field>
              )}
            </ToggleRow>

            <ToggleRow
              name="roof"
              label="Roof"
              checked={hasRoof}
              onChange={setHasRoof}
            >
              {hasRoof && (
                <Field label="Roof area (m²)">
                  <input
                    name="roofArea"
                    type="number"
                    min="1"
                    defaultValue={v.roofArea ?? ""}
                    className={`${inputCls} w-full`}
                    placeholder="40"
                  />
                </Field>
              )}
            </ToggleRow>

            <ToggleRow
              name="pool"
              label="Private pool"
              defaultChecked={v.pool}
            />
            <ToggleRow
              name="canAddPool"
              label="Pool can be added"
              defaultChecked={v.canAddPool}
            />
            <ToggleRow
              name="parking"
              label="Parking"
              defaultChecked={v.parking}
            />
            <ToggleRow
              name="furnished"
              label="Furnished"
              defaultChecked={v.furnished}
            />
          </div>
        </Section>

        <PricingSection v={v} />

        <Section title="Availability">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Status" required>
              <select
                name="status"
                required
                defaultValue={v.status ?? ""}
                className={inputCls}
              >
                {!v.status && <option value="">Select status</option>}
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
            {!readyToMove && (
              <Field label="Delivery date">
                <input
                  name="deliveryDate"
                  type="date"
                  defaultValue={
                    v.deliveryDate ? v.deliveryDate.split("T")[0] : ""
                  }
                  className={inputCls}
                />
              </Field>
            )}
          </div>
          <ToggleRow
            name="isReadyToMove"
            label="Ready to move in"
            checked={readyToMove}
            onChange={setReadyToMove}
          />
        </Section>

        <Section title="Listing">
          <ToggleRow
            name="Hot"
            label="Featured listing"
            defaultChecked={v.Hot}
          />
        </Section>

        {extraSections}

        <div className="flex justify-between items-center mt-2">
          <div>{footerLeft}</div>
          <div className="flex gap-3">
            {footerExtras}
            <Link
              to={cancelHref}
              className={`text-sm text-gray-600 ${inputCls} hover:bg-gray-50`}
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="bg-gray-900 text-white text-sm px-6 py-2 hover:bg-gray-700"
            >
              {submitLabel}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function PricingSection({ v }: { v: UnitFormValues }) {
  const [price, setPrice] = useState<number | null>(v.price ?? null);
  const [downpayment, setDownpayment] = useState<number | null>(
    v.downpayment ?? null,
  );
  const [years, setYears] = useState<number>(
    v.paymentMonths ? Math.floor(v.paymentMonths / 12) : 0,
  );
  const [months, setMonths] = useState<number>(
    v.paymentMonths ? v.paymentMonths % 12 : 0,
  );

  const totalMonths = years * 12 + months;
  const remaining =
    price !== null && downpayment !== null
      ? Math.max(price - downpayment, 0)
      : null;
  const perInstallment =
    remaining !== null && totalMonths > 0
      ? Math.round(remaining / totalMonths)
      : null;

  return (
    <Section title="Pricing">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Price (EGP)" required>
          <MoneyInput
            name="price"
            defaultValue={v.price}
            required
            placeholder="4,500,000"
            className={inputCls}
            onChange={setPrice}
          />
        </Field>
        <Field label="Down payment (EGP)">
          <MoneyInput
            name="downpayment"
            defaultValue={v.downpayment}
            placeholder="500,000"
            className={inputCls}
            onChange={setDownpayment}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Pay over (years)">
          <input
            type="number"
            min="0"
            value={years || ""}
            onChange={(e) => setYears(Number(e.target.value) || 0)}
            className={inputCls}
            placeholder="3"
          />
        </Field>
        <Field label="And months">
          <input
            type="number"
            min="0"
            max="11"
            value={months || ""}
            onChange={(e) => setMonths(Number(e.target.value) || 0)}
            className={inputCls}
            placeholder="0"
          />
        </Field>
      </div>

      {/* Single hidden input for the actual stored value */}
      <input type="hidden" name="paymentMonths" value={totalMonths || ""} />

      {/* Live preview */}
      {remaining !== null && totalMonths > 0 && (
        <div className="border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600 space-y-1">
          <div className="flex justify-between">
            <span>Remaining after down payment:</span>
            <span className="font-medium text-gray-900">
              {remaining.toLocaleString()} EGP
            </span>
          </div>
          <div className="flex justify-between">
            <span>Per month over {formatDuration(totalMonths)}:</span>
            <span className="font-medium text-gray-900">
              {perInstallment?.toLocaleString()} EGP
            </span>
          </div>
        </div>
      )}

      <Field label="Commission (EGP)">
        <MoneyInput
          name="commission"
          defaultValue={v.commission}
          placeholder="112,500"
          className={inputCls}
        />
      </Field>

      <Field label="Maintenance (EGP)">
        <MoneyInput
          name="maintenance"
          defaultValue={v.maintenance}
          placeholder="50,000"
          className={inputCls}
        />
      </Field>

      <Field label="Payment plan notes">
        <textarea
          name="paymentNotes"
          rows={3}
          defaultValue={v.paymentNotes ?? ""}
          className={`${inputCls} w-full resize-none`}
          placeholder="e.g. First installment due 6 months after delivery"
        />
      </Field>
    </Section>
  );
}
