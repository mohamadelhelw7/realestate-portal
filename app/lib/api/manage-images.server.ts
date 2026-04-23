import { type Unit } from "../types";

const API_URL = process.env.API_URL;
const API_KEY = process.env.PORTAL_API_KEY ?? "";

const portalHeaders = {
  "Content-Type": "application/json",
  "x-api-key": API_KEY,
};

export async function uploadImages(
  id: string,
  files: File[],
  isCover: boolean,
): Promise<void> {
  try {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    const res = await fetch(
      `${API_URL}/portal/units/${id}/images?isCover=${isCover}`,
      {
        method: "POST",
        headers: { "x-api-key": API_KEY },
        body: formData,
      },
    );
    if (!res.ok) throw new Error("Failed to upload images");
  } catch {
    throw new Error("Failed to upload images");
  }
}

export async function deleteImage(
  unitId: string,
  imageId: string,
): Promise<void> {
  try {
    const res = await fetch(
      `${API_URL}/portal/units/${unitId}/images/${imageId}`,
      {
        method: "DELETE",
        headers: portalHeaders,
      },
    );
    if (!res.ok) throw new Error("Failed to delete image");
  } catch {
    throw new Error("Failed to delete image");
  }
}

export async function setCoverImage(
  unitId: string,
  imageId: string,
): Promise<void> {
  try {
    const res = await fetch(
      `${API_URL}/portal/units/${unitId}/images/${imageId}/cover`,
      {
        method: "PATCH",
        headers: portalHeaders,
      },
    );
    if (!res.ok) throw new Error("Failed to set cover image");
  } catch {
    throw new Error("Failed to set cover image");
  }
}
