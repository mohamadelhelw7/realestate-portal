import type { Route } from "./+types/units.$id.images";
import { Link } from "react-router";
import { Header } from "~/components/layout/Header";
import { ImageManager } from "~/components/units/ImagesManager";

export async function loader({ params }: Route.LoaderArgs) {
  const { id } = params as { id: string };
  const res = await fetch(`${process.env.API_URL}/units/${id}`);
  if (!res.ok) throw new Response("Not found", { status: 404 });
  const unit = await res.json();
  return { unit };
}

export async function action({ request, params }: Route.ActionArgs) {
  const { id } = params as { id: string };
  const formData = await request.formData();
  const intent = formData.get("intent");

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

  return { ok: false };
}

export default function UnitImagesPage({ loaderData }: Route.ComponentProps) {
  const { unit } = loaderData;

  return (
    <div>
      <Header
        title={`Images — ${unit.title}`}
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
        <ImageManager unitId={unit.id} images={unit.images ?? []} />
      </div>
    </div>
  );
}
