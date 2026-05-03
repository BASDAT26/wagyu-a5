export interface Venue {
  venueId: string;
  venueName: string;
  capacity: number;
  address: string;
  city: string;
}

export interface Seat {
  seatId: string;
  section: string;
  seatNumber: string;
  rowNumber: string;
  venueId: string;
}
