export interface Event {
  eventId: string;
  eventDatetime: Date;
  eventTitle: string;
  venueId: string;
  organizerId: string;
}

export interface Artist {
  artistId: string;
  name: string;
  genre?: string;
}

export interface EventArtist {
  eventId: string;
  artistId: string;
  role?: string;
}
