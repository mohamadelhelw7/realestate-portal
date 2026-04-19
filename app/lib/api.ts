import { type PaginatedUnits, type Unit } from "./types";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
const API_KEY = process.env.PORTAL_API_KEY ?? "";

const portalHeaders = {
  "Content-Type": "application/json",
  "x-api-key": API_KEY,
};

export async function createUnit(data: object): Promise<Unit> {
  try {
    const res = await fetch(`${BASE_URL}/portal/units`, {
      method: "POST",
      headers: portalHeaders,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create unit");
    return res.json();
  } catch {
    throw new Error("Failed to create unit");
  }
}

export async function updateUnit(id: string, data: object): Promise<Unit> {
  try {
    const res = await fetch(`${BASE_URL}/portal/units/${id}`, {
      method: "PATCH",
      headers: portalHeaders,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update unit");
    return res.json();
  } catch {
    throw new Error("Failed to update unit");
  }
}

export async function deleteUnit(id: string): Promise<void> {
  try {
    const res = await fetch(`${BASE_URL}/portal/units/${id}`, {
      method: "DELETE",
      headers: portalHeaders,
    });
    if (!res.ok) throw new Error("Failed to delete unit");
  } catch {
    throw new Error("Failed to delete unit");
  }
}

export async function changeStatus(
  id: string,
  status: "available" | "sold" | "rented",
): Promise<Unit> {
  try {
    const res = await fetch(`${BASE_URL}/portal/units/${id}/status`, {
      method: "PATCH",
      headers: portalHeaders,
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error("Failed to change status");
    return res.json();
  } catch {
    throw new Error("Failed to change status");
  }
}

export async function toggleHot(id: string): Promise<Unit> {
  try {
    const res = await fetch(`${BASE_URL}/portal/units/${id}/hot`, {
      method: "PATCH",
      headers: portalHeaders,
    });
    if (!res.ok) throw new Error("Failed to toggle hot");
    return res.json();
  } catch {
    throw new Error("Failed to toggle hot");
  }
}

export async function uploadImages(
  id: string,
  files: File[],
  isCover: boolean,
): Promise<void> {
  try {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    const res = await fetch(
      `${BASE_URL}/portal/units/${id}/images?isCover=${isCover}`,
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
      `${BASE_URL}/portal/units/${unitId}/images/${imageId}`,
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
      `${BASE_URL}/portal/units/${unitId}/images/${imageId}/cover`,
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

export async function getUnits(
  params?: Record<string, string>,
): Promise<PaginatedUnits> {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${BASE_URL}/units?${query}`);
    if (!res.ok) throw new Error("Failed to fetch units");
    return res.json();
  } catch {
    return { units: [], hasMore: false, nextCursor: undefined };
  }
}

export async function getUnitDetails(id: string): Promise<Unit | null> {
  try {
    const res = await fetch(`${BASE_URL}/units/${id}`);
    if (!res.ok) throw new Error("Failed to fetch unit");
    return res.json();
  } catch {
    return null;
  }
}
