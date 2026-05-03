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

/** Event item used in the event listing grid */
export interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  venueName: string;
  venueCity: string;
  artists: string[];
  ticketCategories: TicketCategoryDisplay[];
  icon: "music" | "palette" | "guitar";
}
