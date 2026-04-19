export interface Unit {
  id: string;
  title: string;
  description?: string;
  price: number;
  downpayment?: number;
  installments?: number;
  cycle?: 3 | 6 | 12;
  area: number;
  bedrooms: number;
  bathrooms: number;
  floor?: number;
  totalFloors?: number;
  phase: string;
  city: string;
  compound?: string;
  type: string;
  purpose: string;
  status: string;
  furnished: boolean;
  parking: boolean;
  garden: boolean;
  gardenArea?: number;
  pool: boolean;
  canAddPool: boolean;
  Hot: boolean;
  isReadyToMove: boolean;
  deliveryDate?: string;
  sellerId?: string;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
  images?: Image[];
}

export interface Image {
  id: string;
  url: string;
  isCover: boolean;
  unitId: string;
}

export interface PaginatedUnits {
  units: Unit[];
  hasMore: boolean;
  nextCursor?: string;
}

export interface FilterParams {
  purpose?: string;
  type?: string;
  city?: string;
  bedrooms?: string;
  minPrice?: string;
  maxPrice?: string;
  isReadyToMove?: string;
  furnished?: string;
  parking?: string;
  pool?: string;
}
