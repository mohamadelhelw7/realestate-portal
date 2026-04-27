import { redirect } from "react-router";
import type { Route } from "./+types/units.new";
import { Header } from "~/components/layout/Header";
import { Link } from "react-router";
import { SellerSection } from "~/components/layout/SellerSection";
import { createUnit } from "~/lib/api/manage-units.server";
import { parseUnitFormData } from "~/lib/unit-form.server";
import { UnitForm } from "~/components/units/UnitForm";

export async function action({ request }: Route.ActionArgs) {
  const f = await request.formData();
  const data = {
    ...parseUnitFormData(f),
    sellerFirstName: f.get("sellerFirstName"),
    sellerLastName: f.get("sellerLastName"),
    sellerPhoneNumber: f.get("sellerPhoneNumber"),
    sellerEmail: f.get("sellerEmail") || undefined,
    sellerNotes: f.get("sellerNotes") || undefined,
  };

  const unit = await createUnit(data);
  return redirect(`/units/${unit.id}/images`);
}

export default function AddUnitPage({ actionData }: Route.ComponentProps) {
  const error = (actionData as any)?.error;

  return (
    <div>
      <Header
        title="Add unit"
        action={
          <Link
            to="/units"
            className="text-sm text-gray-600 border border-gray-300 px-3 py-2 hover:bg-gray-50"
          >
            Cancel
          </Link>
        }
      />
      <UnitForm
        error={error}
        submitLabel="Save unit"
        extraSections={<SellerSection />}
      />
    </div>
  );
}
