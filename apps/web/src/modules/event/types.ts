// [REFACTOR] Consolidated from 3 separate TicketCategory definitions across
// create-event.tsx, update-event.tsx, and read-event.tsx

/** Ticket category used in event forms (create/update) — string values for form inputs */
export interface TicketCategoryForm {
  name: string;
  price: string;
  quantity: string;
}

/** Ticket category used for display (read) — numeric values */
export interface TicketCategoryDisplay {
  name: string;
  price: number;
  quantity: number;
}

/** Event row returned from the backend */
export interface Event {
  event_id: string;
  event_datetime: string;
  event_title: string;
  venue_id: string;
  organizer_id: string;
}

/** Artist row returned from the backend */
export interface Artist {
  artist_id: string;
  name: string;
  genre: string | null;
}

/** EventArtist join row returned from the backend */
export interface EventArtist {
  event_id: string;
  artist_id: string;
  role: string | null;
  artist_name: string;
  genre: string | null;
}

/** Venue row (minimal, for dropdowns) */
export interface VenueOption {
  venue_id: string;
  venue_name: string;
  capacity: number;
  address: string;
  city: string;
}
