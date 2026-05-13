export interface TicketEnriched {
  ticket_id: string;
  ticket_code: string;
  tcategory_id: string;
  torder_id: string;
  status: string;
  category_name: string;
  price: number;
  event_title: string;
  event_datetime: string;
  event_id: string;
  venue_name: string;
  order_id: string;
  payment_status: string;
  customer_name: string;
  customer_id: string;
  section?: string | null;
  seat_number?: string | null;
  row_number?: string | null;
}
