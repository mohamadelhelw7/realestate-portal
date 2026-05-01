import type { Route } from "./+types/units.$id.view";
import { Link } from "react-router";
import { Header } from "~/components/layout/Header";
import { ImageGallery } from "~/components/layout/ImageGallery";
import { getUnitDetails } from "~/lib/api/manage-units.server";
import { formatDuration } from "~/lib/format";

const FINISHING_LABELS: Record<string, string> = {
  core_and_shell: "Core & shell",
  semi_finished: "Semi-finished",
  fully_finished: "Fully finished",
};

export async function loader({ params }: Route.LoaderArgs) {
  const { id } = params as { id: string };
  const unit = await getUnitDetails(id);
  if (!unit) throw new Response("Not found", { status: 404 });
  return { unit };
}

const money = (n: number | null | undefined) =>
  n != null ? `EGP ${n.toLocaleString()}` : "—";

const yesNo = (v: boolean | null | undefined) => (v ? "Yes" : "No");

export default function UnitViewPage({ loaderData }: Route.ComponentProps) {
  const { unit } = loaderData;
  const remaining =
    unit.downpayment != null ? unit.price - unit.downpayment : null;

  const basicInfo = [
    { label: "Unit ID", value: unit.id },
    { label: "Title", value: unit.title },
    { label: "Purpose", value: unit.purpose },
    { label: "Type", value: unit.type },
    { label: "Status", value: unit.status },
    { label: "City", value: unit.city },
    { label: "Phase", value: unit.phase },
    { label: "Compound", value: unit.compound ?? "—" },
    { label: "Description", value: unit.description ?? "—" },
  ];

  const unitDetails = [
    { label: "Area", value: `${unit.area} m²` },
    { label: "Bedrooms", value: unit.bedrooms },
    { label: "Bathrooms", value: unit.bathrooms },
    { label: "Floor", value: unit.floor ?? "—" },
    {
      label: "Finishing",
      value: unit.finishing
        ? (FINISHING_LABELS[unit.finishing] ?? unit.finishing)
        : "—",
    },
    { label: "Ready to move", value: yesNo(unit.isReadyToMove) },
    {
      label: "Delivery date",
      value: unit.deliveryDate
        ? new Date(unit.deliveryDate).toLocaleDateString("en-GB", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "—",
    },
  ];

  const pricing = [
    { label: "Price", value: money(unit.price) },
    { label: "Down payment", value: money(unit.downpayment) },
    { label: "Remaining", value: money(remaining) },
    {
      label: "Payment duration",
      value: unit.paymentMonths ? formatDuration(unit.paymentMonths) : "—",
    },
    { label: "Maintenance", value: money(unit.maintenance) },
    { label: "Commission", value: money(unit.commission) },
    { label: "Payment notes", value: unit.paymentNotes ?? "—" },
  ];

  const features = [
    { label: "Furnished", value: yesNo(unit.furnished) },
    { label: "Parking", value: yesNo(unit.parking) },
    { label: "Pool", value: yesNo(unit.pool) },
    { label: "Can add pool", value: yesNo(unit.canAddPool) },
    { label: "Garden", value: yesNo(unit.garden) },
    {
      label: "Garden area",
      value: unit.gardenArea ? `${unit.gardenArea} m²` : "—",
    },
    { label: "Roof", value: yesNo(unit.roof) },
    {
      label: "Roof area",
      value: unit.roofArea ? `${unit.roofArea} m²` : "—",
    },
    { label: "Featured (Hot)", value: yesNo(unit.Hot) },
  ];

  const sellerInfo = unit.seller
    ? [
        {
          label: "Name",
          value: `${unit.seller.firstName} ${unit.seller.lastName}`,
        },
        { label: "Phone", value: unit.seller.phoneNumber },
        { label: "Email", value: unit.seller.email ?? "—" },
        { label: "Notes", value: unit.seller.notes ?? "—" },
      ]
    : null;

  return (
    <div>
      <Header
        title={unit.title}
        action={
          <div className="flex gap-2">
            <Link
              to={`/units/${unit.id}/edit`}
              className="text-sm text-blue-600 border border-blue-200 px-4 py-2 hover:bg-blue-50"
            >
              Edit
            </Link>
            <Link
              to={`/units/${unit.id}/images`}
              className="text-sm text-gray-600 border border-gray-300 px-4 py-2 hover:bg-gray-50"
            >
              Manage images
            </Link>
            <Link
              to="/units"
              className="text-sm text-gray-600 border border-gray-300 px-4 py-2 hover:bg-gray-50"
            >
              Back
            </Link>
          </div>
        }
      />

      <div className="p-6 max-w-3xl flex flex-col gap-4">
        <Section title="Basic info" rows={basicInfo} />
        <Section title="Unit details" rows={unitDetails} />
        <Section title="Pricing" rows={pricing} />
        <Section title="Features" rows={features} />
        {sellerInfo && <Section title="Seller info" rows={sellerInfo} />}
        {unit.images && unit.images.length > 0 && (
          <ImageGallery images={unit.images} />
        )}
      </div>
    </div>
  );
}

function Section({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; value: React.ReactNode }[];
}) {
  return (
    <div className="border border-gray-300 bg-white">
      <div className="px-4 py-2.5 bg-gray-100 border-b border-gray-300 text-sm font-medium text-gray-700">
        {title}
      </div>
      <table className="w-full text-sm">
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="px-4 py-2.5 text-gray-500 border-r border-gray-200 w-40 align-top">
                {row.label}
              </td>
              <td className="px-4 py-2.5 text-gray-900 whitespace-pre-wrap">
                {row.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
