import type { Route } from "./+types/units.$id.images";
import { useNavigate } from "react-router";
import { useRef, useState } from "react";
import { Header } from "~/components/layout/Header";
import {
  ImageManager,
  type ImageManagerHandle,
} from "~/components/units/ImagesManager";
import {
  deleteImage,
  setCoverImage,
  uploadImages,
} from "~/lib/api/manage-images.server";

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
    const images = await uploadImages(id, files, isCover);
    return images;
  }
  if (intent === "deleteImage") {
    const imageId = formData.get("imageId") as string;
    await deleteImage(id, imageId);
    return { ok: true };
  }
  if (intent === "setCover") {
    const imageId = formData.get("imageId") as string;
    await setCoverImage(id, imageId);
    return { ok: true };
  }
  return { ok: false };
}

export default function UnitImagesPage({ loaderData }: Route.ComponentProps) {
  const { unit } = loaderData;
  const navigate = useNavigate();
  const managerRef = useRef<ImageManagerHandle>(null);
  const [hasPending, setHasPending] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCancel = () => {
    if (hasPending) {
      if (!confirm("Discard unsaved changes?")) return;
      managerRef.current?.discard();
    }
    navigate(`/units/${unit.id}`);
  };

  const handleFinish = async () => {
    setError(null);
    if (!hasPending) {
      navigate(`/units/${unit.id}/view`);
      return;
    }
    setSaving(true);
    try {
      await managerRef.current?.flush();
      navigate(`/units/${unit.id}/view`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save changes");
      setSaving(false);
    }
  };

  return (
    <div>
      <Header
        title={`Images — ${unit.title}`}
        action={
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="text-sm text-gray-600 border border-gray-300 px-4 py-2 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleFinish}
              disabled={saving}
              className="text-sm bg-gray-900 text-white px-4 py-2 hover:bg-gray-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : hasPending ? "Save & finish" : "Finish"}
            </button>
          </div>
        }
      />
      <div className="p-6 max-w-3xl">
        {error && (
          <div className="mb-4 border border-red-300 bg-red-50 text-red-700 text-sm px-3 py-2">
            {error}
          </div>
        )}
        <ImageManager
          ref={managerRef}
          unitId={unit.id}
          images={unit.images ?? []}
          onPendingChange={setHasPending}
        />
      </div>
    </div>
  );
}
