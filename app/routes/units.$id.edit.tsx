import { redirect } from "react-router";
import type { Route } from "./+types/units.$id.edit";
import { Header } from "~/components/layout/Header";
import { Link } from "react-router";
import {
  deleteUnit,
  getUnitDetails,
  updateUnit,
} from "~/lib/api/manage-units.server";
import { parseUnitFormData } from "~/lib/unit-form.server";
import { UnitForm } from "~/components/units/UnitForm";

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

  await updateUnit(id, parseUnitFormData(formData));
  return redirect("/units");
}

export default function EditUnitPage({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { unit } = loaderData;
  const error = (actionData as any)?.error;

  return (
    <div>
      <Header
        title={`Edit — ${unit.title}`}
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
        initialValues={unit}
        error={error}
        submitLabel="Save changes"
        footerLeft={
          <button
            type="submit"
            form="delete-unit-form"
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
        }
        footerExtras={
          <Link
            to={`/units/${unit.id}/images`}
            className="text-sm text-gray-600 border border-gray-300 px-3 py-2 hover:bg-gray-50"
          >
            Manage images
          </Link>
        }
      />

      {/* Delete form lives outside UnitForm so it doesn't nest inside the main form */}
      <form method="post" id="delete-unit-form" className="hidden">
        <input type="hidden" name="intent" value="delete" />
      </form>
    </div>
  );
}
