export interface Venue {
  id: string;
  name: string;
  capacity: number;
  city: string;
  address: string;
  hasReservedSeating: boolean;
}

export interface Event {
  title: string;
  date: string;
  time: string;
  venue: Venue;
  artists: string[]; //to be changed
  ticketCategory: string; //to be changed
  description: string; //to be changed
}
