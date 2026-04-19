import { redirect } from "react-router";
import type { Route } from "./+types/units.$id.edit";
import { Header } from "~/components/layout/Header";
import { Link } from "react-router";
import { ImageManager } from "~/components/units/ImagesManager";

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

export async function loader({ params }: Route.LoaderArgs) {
  const { id } = params as { id: string };
  const res = await fetch(`${process.env.API_URL}/units/${id}`);
  if (!res.ok) throw new Response("Not found", { status: 404 });
  const unit = await res.json();
  return { unit };
}

export async function action({ request, params }: Route.ActionArgs) {
  const { id } = params as { id: string };
  const contentType = request.headers.get("content-type") ?? "";
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "delete") {
    const res = await fetch(`${process.env.API_URL}/portal/units/${id}`, {
      method: "DELETE",
      headers: { "x-api-key": process.env.PORTAL_API_KEY! },
    });
    if (!res.ok) throw new Error("Failed to delete unit");
    return redirect("/units");
  }

  if (intent === "uploadImages") {
    const isCover = formData.get("isCover") === "true";
    const files = formData.getAll("images") as File[];
    const uploadData = new FormData();
    files.forEach((file) => uploadData.append("images", file));
    const res = await fetch(
      `${process.env.API_URL}/portal/units/${id}/images?isCover=${isCover}`,
      {
        method: "POST",
        headers: { "x-api-key": process.env.PORTAL_API_KEY! },
        body: uploadData,
        // @ts-ignore
        duplex: "half",
      },
    );
    if (!res.ok) throw new Error("Failed to upload images");
    return await res.json();
  }

  if (intent === "deleteImage") {
    const imageId = formData.get("imageId") as string;
    const res = await fetch(
      `${process.env.API_URL}/portal/units/${id}/images/${imageId}`,
      {
        method: "DELETE",
        headers: { "x-api-key": process.env.PORTAL_API_KEY! },
      },
    );
    if (!res.ok) throw new Error("Failed to delete image");
    return { ok: true };
  }

  if (intent === "setCover") {
    const imageId = formData.get("imageId") as string;
    const res = await fetch(
      `${process.env.API_URL}/portal/units/${id}/images/${imageId}/cover`,
      {
        method: "PATCH",
        headers: { "x-api-key": process.env.PORTAL_API_KEY! },
      },
    );
    if (!res.ok) throw new Error("Failed to set cover");
    return { ok: true };
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

  const res = await fetch(`${process.env.API_URL}/portal/units/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.PORTAL_API_KEY!,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to update unit");
  return redirect("/units");
}

export default function EditUnitPage({ loaderData }: Route.ComponentProps) {
  const { unit } = loaderData;

  return (
    <div>
      <Header
        title={`Edit — ${unit.title}`}
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
                  defaultValue={unit.title}
                  className="border border-gray-300 px-3 py-2 text-sm w-full"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-600">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={unit.description ?? ""}
                  className="border border-gray-300 px-3 py-2 text-sm w-full resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-600">Purpose *</label>
                  <select
                    name="purpose"
                    required
                    defaultValue={unit.purpose}
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
                    defaultValue={unit.type}
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
                    defaultValue={unit.status}
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
                    defaultValue={
                      unit.deliveryDate ? unit.deliveryDate.split("T")[0] : ""
                    }
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
                    defaultValue={unit.city}
                    className="border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-600">Phase *</label>
                  <input
                    name="phase"
                    required
                    defaultValue={unit.phase}
                    className="border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-600">Compound</label>
                <input
                  name="compound"
                  defaultValue={unit.compound ?? ""}
                  className="border border-gray-300 px-3 py-2 text-sm"
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
                    defaultValue={unit.area}
                    className="border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-600">Bedrooms *</label>
                  <input
                    name="bedrooms"
                    type="number"
                    required
                    defaultValue={unit.bedrooms}
                    className="border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-600">Bathrooms *</label>
                  <input
                    name="bathrooms"
                    type="number"
                    required
                    defaultValue={unit.bathrooms}
                    className="border border-gray-300 px-3 py-2 text-sm"
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
                    className="border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-600">Total floors</label>
                  <input
                    name="totalFloors"
                    type="number"
                    defaultValue={unit.totalFloors ?? ""}
                    className="border border-gray-300 px-3 py-2 text-sm"
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
                    defaultValue={unit.price}
                    className="border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-600">Down payment</label>
                  <input
                    name="downpayment"
                    type="number"
                    defaultValue={unit.downpayment ?? ""}
                    className="border border-gray-300 px-3 py-2 text-sm"
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
                    className="border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-600">
                    Cycle (months)
                  </label>
                  <select
                    name="cycle"
                    defaultValue={unit.cycle ?? ""}
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
                      defaultChecked={
                        unit[f.name as keyof typeof unit] === true
                      }
                      className="w-4 h-4"
                    />
                    {f.label}
                  </label>
                ))}
              </div>
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
                  ) {
                    e.preventDefault();
                  }
                }}
                className="text-sm text-red-600 border border-red-300 px-4 py-2 hover:bg-red-50"
              >
                Delete unit
              </button>
            </form>
            <div className="flex gap-3">
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
                Save changes
              </button>
            </div>
          </div>
        </form>

        <div className="mt-4">
          <ImageManager unitId={unit.id} images={unit.images ?? []} />
        </div>
      </div>
    </div>
  );
}
