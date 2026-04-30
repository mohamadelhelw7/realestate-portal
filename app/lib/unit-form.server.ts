import { num } from "~/lib/utils";

export function parseUnitFormData(f: FormData) {
  const g = (key: string) => f.get(key);

  // If "Ready to move", clear delivery date. If garden unchecked, clear gardenArea. Same for roof.
  const garden = g("garden") === "true";
  const roof = g("roof") === "true";
  const isReadyToMove = g("isReadyToMove") === "true";

  const deliveryDate =
    !isReadyToMove && g("deliveryDate")
      ? new Date(g("deliveryDate") as string).toISOString()
      : undefined;

  return {
    title: g("title"),
    description: g("description") || undefined,
    price: Number(g("price")),
    downpayment: num(g("downpayment")),
    installments: num(g("installments")),
    cycle: num(g("cycle")),
    commission: num(g("commission")),
    area: Number(g("area")),
    bedrooms: Number(g("bedrooms")),
    bathrooms: Number(g("bathrooms")),
    floor: num(g("floor")),
    totalFloors: num(g("totalFloors")),
    phase: g("phase"),
    city: g("city"),
    compound: g("compound") || undefined,
    type: g("type"),
    purpose: g("purpose"),
    status: g("status"),
    furnished: g("furnished") === "true",
    parking: g("parking") === "true",
    garden,
    gardenArea: garden ? num(g("gardenArea")) : undefined,
    roof,
    roofArea: roof ? num(g("roofArea")) : undefined,
    pool: g("pool") === "true",
    canAddPool: g("canAddPool") === "true",
    Hot: g("Hot") === "true",
    isReadyToMove,
    deliveryDate,
    paymentMonths: num(g("paymentMonths")),
    paymentNotes: g("paymentNotes") || undefined,
    finishing: g("finishing") || undefined,
    maintenance: num(g("maintenance")),
  };
}
