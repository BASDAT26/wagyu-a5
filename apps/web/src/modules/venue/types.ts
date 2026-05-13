// [REFACTOR] Extracted from KUNING/interface.ts — single source of truth for Venue types

export interface Venue {
  venue_id: string;
  venue_name: string;
  capacity: number;
  address: string;
  city: string;
}
