export interface TicketCategory {
  categoryId: string;
  categoryName: string;
  quota: number;
  price: number;
  teventId: string;
}

export interface Ticket {
  ticketId: string;
  ticketCode: string;
  tcategoryId: string;
  torderId: string;
}

export interface HasRelationship {
  seatId: string;
  ticketId: string;
}
