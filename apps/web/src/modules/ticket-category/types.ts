export interface TicketCategory {
  category_id: string;
  category_name: string;
  quota: number;
  price: number;
  tevent_id: string;
  event_name?: string;
}
