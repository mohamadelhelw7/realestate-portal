import { type PaginatedUnits, type Unit } from "../types";

const API_URL = process.env.API_URL;
const API_KEY = process.env.PORTAL_API_KEY ?? "";

const portalHeaders = {
  "Content-Type": "application/json",
  "x-api-key": API_KEY,
};

export async function createUnit(data: object): Promise<Unit> {
  try {
    const res = await fetch(`${API_URL}/portal/units`, {
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
    const res = await fetch(`${API_URL}/portal/units/${id}`, {
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
    const res = await fetch(`${API_URL}/portal/units/${id}`, {
      method: "DELETE",
      headers: portalHeaders,
    });
    if (!res.ok) throw new Error("Failed to delete unit");
  } catch {
    throw new Error("Failed to delete unit");
  }
}

export async function getUnits(
  params?: Record<string, string>,
): Promise<PaginatedUnits> {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_URL}/units?${query}`);
    if (!res.ok) {
      const error = await res.text();
      console.error("Failed to fetch units:", res.status, error);
      throw new Error(`Failed to fetch units: ${res.status} ${error}`);
    }
    return res.json();
  } catch (error) {
    console.error("getUnits error:", error);
    return { units: [], hasMore: false, nextCursor: undefined };
  }
}

export async function getUnitDetails(id: string): Promise<Unit | null> {
  try {
    const res = await fetch(`${API_URL}/units/${id}`);
    if (!res.ok) throw new Error("Failed to fetch unit");
    return res.json();
  } catch {
    return null;
  }
}

export async function toggleHot(id: string): Promise<Unit> {
  try {
    const res = await fetch(`${API_URL}/portal/units/${id}/hot`, {
      method: "PATCH",
      headers: portalHeaders,
    });
    if (!res.ok) throw new Error("Failed to toggle hot");
    return res.json();
  } catch {
    throw new Error("Failed to toggle hot");
  }
}

export async function changeStatus(
  id: string,
  status: "available" | "sold" | "rented",
): Promise<Unit> {
  try {
    const res = await fetch(`${API_URL}/portal/units/${id}/status`, {
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
