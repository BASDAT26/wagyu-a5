// [REFACTOR] Extracted from KUNING/interface.ts — single source of truth for Venue types

export interface Venue {
  id: string;
  name: string;
  capacity: number;
  city: string;
  address: string;
  hasReservedSeating: boolean;
}
