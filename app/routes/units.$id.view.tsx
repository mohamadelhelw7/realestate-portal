import type { Route } from "./+types/units.$id.view";
import { Link } from "react-router";
import { Header } from "~/components/layout/Header";
import { ImageGallery } from "~/components/layout/ImageGallery";

export async function loader({ params }: Route.LoaderArgs) {
  const { id } = params as { id: string };
  const res = await fetch(`${process.env.API_URL}/units/${id}`);
  if (!res.ok) throw new Response("Not found", { status: 404 });
  const unit = await res.json();
  return { unit };
}

export default function UnitViewPage({ loaderData }: Route.ComponentProps) {
  const { unit } = loaderData;

  const unitBasicInfo = [
    { label: "Unit Id", value: unit.id },
    { label: "Title", value: unit.title },
    { label: "Purpose", value: unit.purpose },
    { label: "Type", value: unit.type },
    { label: "Status", value: unit.status },
    { label: "City", value: unit.city },
    { label: "Phase", value: unit.phase },
    { label: "Compound", value: unit.compound ?? "—" },
    { label: "Description", value: unit.description ?? "—" },
  ];

  const unitPricing = [
    { label: "Price", value: `EGP ${unit.price.toLocaleString()}` },
    {
      label: "Down payment",
      value: unit.downpayment
        ? `EGP ${unit.downpayment.toLocaleString()}`
        : "—",
    },
    {
      label: "Installment",
      value: unit.installments
        ? `EGP ${unit.installments.toLocaleString()}`
        : "—",
    },
    {
      label: "Cycle",
      value: unit.cycle ? `${unit.cycle} months` : "—",
    },
  ];

  const unitDetails = [
    { label: "Area", value: `${unit.area} m²` },
    { label: "Bedrooms", value: unit.bedrooms },
    { label: "Bathrooms", value: unit.bathrooms },
    { label: "Floor", value: unit.floor ?? "—" },
    { label: "Total floors", value: unit.totalFloors ?? "—" },
    {
      label: "Ready to move",
      value: unit.isReadyToMove ? "Yes" : "No",
    },
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

  const sellerInfo = [
    {
      label: "Name",
      value: "M Tarek",
    },
    { label: "Phone", value: "01092885724" },
    { label: "Type", value: "—" },
    { label: "Area", value: "—" },
  ];

  // const sellerInfo = [
  //   {
  //     label: "Name",
  //     value: `${unit.seller.firstName} ${unit.seller.lastName}`,
  //   },
  //   { label: "Phone", value: unit.seller.phoneNumber },
  //   { label: "Type", value: unit.seller.type ?? "—" },
  //   { label: "Area", value: unit.seller.area ?? "—" },
  // ];

  const unitFeatures = [
    { label: "Furnished", value: unit.furnished ? "Yes" : "No" },
    { label: "Parking", value: unit.parking ? "Yes" : "No" },
    { label: "Pool", value: unit.pool ? "Yes" : "No" },
    { label: "Garden", value: unit.garden ? "Yes" : "No" },
    {
      label: "Garden area",
      value: unit.gardenArea ? `${unit.gardenArea} m²` : "—",
    },
    {
      label: "Can add pool",
      value: unit.canAddPool ? "Yes" : "No",
    },
    { label: "Hot", value: unit.Hot ? "Yes" : "No" },
  ];

  return (
    <div>
      <Header
        title={unit.title}
        action={
          <div className="flex gap-2">
            <Link
              to={`/units/${unit.id}`}
              className="text-sm text-blue-600 border border-blue-200 px-4 py-2 hover:bg-blue-50"
            >
              Edit
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
        <div className="border border-gray-300 bg-white">
          <div className="px-4 py-2.5 bg-gray-100 border-b border-gray-300 text-sm font-medium text-gray-700">
            Basic info
          </div>
          <table className="w-full text-sm">
            <tbody>
              {unitBasicInfo.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-2.5 text-gray-500 border-r border-gray-200 w-40">
                    {row.label}
                  </td>
                  <td className="px-4 py-2.5 text-gray-900">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border border-gray-300 bg-white">
          <div className="px-4 py-2.5 bg-gray-100 border-b border-gray-300 text-sm font-medium text-gray-700">
            Unit details
          </div>
          <table className="w-full text-sm">
            <tbody>
              {unitDetails.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-2.5 text-gray-500 border-r border-gray-200 w-40">
                    {row.label}
                  </td>
                  <td className="px-4 py-2.5 text-gray-900">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border border-gray-300 bg-white">
          <div className="px-4 py-2.5 bg-gray-100 border-b border-gray-300 text-sm font-medium text-gray-700">
            Pricing
          </div>
          <table className="w-full text-sm">
            <tbody>
              {unitPricing.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-2.5 text-gray-500 border-r border-gray-200 w-40">
                    {row.label}
                  </td>
                  <td className="px-4 py-2.5 text-gray-900">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border border-gray-300 bg-white">
          <div className="px-4 py-2.5 bg-gray-100 border-b border-gray-300 text-sm font-medium text-gray-700">
            Features
          </div>
          <table className="w-full text-sm">
            <tbody>
              {unitFeatures.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-2.5 text-gray-500 border-r border-gray-200 w-40">
                    {row.label}
                  </td>
                  <td className="px-4 py-2.5 text-gray-900">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {unit.seller && (
          <div className="border border-gray-300 bg-white">
            <div className="px-4 py-2.5 bg-gray-100 border-b border-gray-300 text-sm font-medium text-gray-700">
              Seller info
            </div>
            <table className="w-full text-sm">
              <tbody>
                {sellerInfo.map((row, i) => (
                  <tr
                    key={i}
                    className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-4 py-2.5 text-gray-500 border-r border-gray-200 w-40">
                      {row.label}
                    </td>
                    <td className="px-4 py-2.5 text-gray-900">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {unit.images?.length > 0 && <ImageGallery images={unit.images ?? []} />}
      </div>
    </div>
  );
}
