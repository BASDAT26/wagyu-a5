export interface Seat {
  seat_id: string;
  section: string;
  seat_number: string;
  row_number: string;
  venue_id: string;
  is_assigned?: boolean;
}
